import IDataBarang from "@/interfaces/DataBarang";
import IFetchResponse from "@/interfaces/FetchResponse";
import { getCookies } from "cookies-next";
import { TmpCookiesObj } from "cookies-next/lib/types";
import React from "react";
import PopupBarang from "@/material/PopupBarang";
import Button from "@/material/Button";
import StatedRangeButton from "@/material/StatedRangeButton";
import Head from "next/head";
import manipulateURL from "@/database/urlcontroller";

export default function Beranda(): JSX.Element {
  const earlyAnimation: any = React.useRef<null>(null);
  const [userdata, setUserdata] = React.useState<TmpCookiesObj>();
  const [barang, setBarang] = React.useState<any[]>([]);
  const header: React.RefObject<HTMLObjectElement> = React.useRef(null);
  const contentBarang: React.RefObject<HTMLObjectElement> = React.useRef(null);
  const mainContent: React.RefObject<HTMLObjectElement> = React.useRef(null);
  const promptBarang: React.RefObject<HTMLDivElement> = React.useRef(null);
  const [itemDataPrompt, setItemDataPrompt] = React.useState<any>();
  const [promptToggle, setPromptToggle] = React.useState<boolean>(false);
  const promptInputState = React.useState<number>(0);
  const tag: React.RefObject<HTMLObjectElement> = React.useRef(null);

  React.useEffect(() => {
    manipulateURL("home", "Elyx Store - Home");

    setUserdata(JSON.parse(decodeURIComponent(getCookies().userdata!)));
  }, []);

  React.useEffect(() => {
    (async (): Promise<any> => {
      await fetch(`/api/dataBarang?barang=${JSON.parse(decodeURIComponent(getCookies().userdata!)).lastsearch}`, {
        method: "get",
        headers: { "Content-Type": "application/json" },
      })
        .then(async (response: IFetchResponse) => {
          if (response.ok) {
            const awaitedData: any[] = await response.json();
            setBarang(awaitedData);
          }
        })
        .catch((err: Error) => console.error(err));
    })();

    earlyAnimation.current?.classList.add("animate__animated");
    earlyAnimation.current?.classList.add("animate__fadeInUp");
    earlyAnimation.current?.classList.add("animate__faster");
  }, [userdata]);

  React.useEffect(() => {
    (async () => {
      let childrens: HTMLCollection = contentBarang.current?.children!;
      for (let i = 0; i < childrens.length!; i++) {
        childrens[i].classList.add("opacity-1");
        childrens[i].classList.add("animate__fadeInUp");
        await new Promise(resolve => setTimeout(resolve, 150));
      }

      await new Promise(resolve => setTimeout(resolve, 150));
      tag.current?.classList.add("animate__fadeInUp");
      await new Promise(resolve => setTimeout(resolve, 150));

      childrens = header.current?.children!;
      for (let i = 0; i < childrens?.length; i++) {
        childrens[i].classList.add("animate__fadeInUp");
        await new Promise(resolve => setTimeout(resolve, 150));
      }
    })();
  }, [barang]);

  const promptBarangHandler = (e: any, item: any): void => {
    setItemDataPrompt(item);
    setPromptToggle(true);
  };

  const masukkanKeranjang = (e: any, data: any): void => {
    fetch(`/api/addkeranjang`, {
      method: "POST",
      body: JSON.stringify({
        username: userdata?.username,
        kodebarang: data.kode,
        namabarang: data.nama,
        hargabarang: data.harga,
        jumlahbarang: promptInputState[0],
        subtotal: parseInt(data.harga) * promptInputState[0],
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then(res => res.json())
      .catch(err => console.error(err));
  };

  const closePromptBarang = (e: any): void => {
    (async (): Promise<any> => {
      promptBarang.current!.classList.remove("overlay");
      promptBarang.current!.classList.add("overlay-reverse");
      await new Promise(resolve => setTimeout(resolve, 300));
      promptInputState[1](0);
      setPromptToggle(false);
      // console.log("removed");
    })();
  };

  return <>
    <Head>
      <title>Elyx Store - Home</title>
    </Head>
    <div className="text-white w-11/12" ref={mainContent}>
      <div ref={header}>
        <h1 className="animate__animated animate__faster opacity-0 text-2xl mb-3 mt-11 font-semibold">
          Selamat Datang, {userdata?.namalengkap}
        </h1>
        <p className="animate__animated animate__faster opacity-0 font-light w-1/2">
          Ada beberapa item baru yang bisa anda belanjakan, selamat berbelanja!
        </p>
      </div>

      <h1
        ref={tag}
        className="animate__animated animate__faster text-[22px] opacity-0 mt-12 font-semibold"
      >
        Berdasarkan Pencarian <span>- {userdata?.lastsearch}</span>
      </h1>
      <div
        ref={contentBarang}
        className="max-w-[100vw] overflow-y-hidden flex gap-3 mt-5 snap-x snap-mandatory overflow-x-scroll pb-1"
      >
        {[1].map(() =>
          barang.map((item: IDataBarang) => {
            // Assuming item is your MongoDB JSON object
            const hexBlob = item.gambar;

            // Convert the hexadecimal string to Uint8Array
            const byteArray = new Uint8Array(hexBlob.match(/[\da-f]{2}/gi)!.map(function (h) {
              return parseInt(h, 16);
            }));

            // Create a Blob object from the Uint8Array with MIME type "image/jpeg"
            const blob = new Blob([byteArray], { type: 'image/jpeg' });

            // Generate a temporary URL for the Blob
            const imageDataUrl = URL.createObjectURL(blob);

            return (
              <div
                key={item.kodebrg}
                className="snap-start inline-block overflow-h-hidden animate__animated opacity-0 bg-[#ffffff13] rounded-xl backdrop-blur-3xl w-44 p-3"
                onClick={e =>
                  promptBarangHandler(e, {
                    harga: item.harga,
                    nama: item.nama,
                    terjual: item.stok,
                    rate: item.rate,
                    toko: item.toko,
                    gambar: imageDataUrl,
                    kode: item.kodebrg,
                  })
                }
              >
                <img
                  className="h-auto w-auto min-w-[152px]"
                  src={imageDataUrl}
                  alt=""
                />
                <div className="w-4/5">
                  <p className="text-[12px] mt-3 mb-1 font-light line-clamp-2">
                    {item.nama}
                  </p>
                  <p className="font-semibold">
                    Rp
                    {item.harga
                      .toString()
                      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
                  </p>
                  <p className="text-xs font-light flex items-center opacity-70 mt-2 line-clamp-1">
                    <i className="fa-solid fa-store mr-1"></i>
                    {item.toko}
                  </p>
                  <p className="text-xs font-light flex items-center opacity-70 mt-1">
                    <i className="fa-sharp fa-solid fa-star mr-1"></i>{" "}
                    {item.rate} | Terjual {item.stok}+
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
      {promptToggle ? (
        <PopupBarang
          reference={promptBarang}
          toggleState={[promptToggle, setPromptToggle]}
          closePromptBarangFn={closePromptBarang}
        >
          <div className="flex h-full">
            <img
              className="h-[80vh] w-[80vw] m-2 rounded-md"
              src={itemDataPrompt.gambar}
              alt=""
            />
            <div className="p-4 ml-2 flex flex-col justify-between">
              <div>
                <h1 className="font-semibold text-xl mb-2">
                  {itemDataPrompt.nama}
                </h1>
                <p className="font-light text-sm">
                  Terjual {itemDataPrompt.terjual}+{" "}
                  <i className="fa-sharp fa-solid fa-star mr-1 ml-2"></i>
                  {itemDataPrompt.rate}
                </p>
                <p className="font-semibold text-2xl mt-3">
                  Rp
                  {itemDataPrompt.harga
                    .toString()
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
                </p>
                <div className="mt-4 font-light">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum
                  ratione tempore doloremque a? Veniam molestias numquam itaque?
                  Fugit eligendi aperiam reprehenderit magni vitae neque, sunt
                  quae maxime soluta quod voluptatum!
                </div>
              </div>
              <div className="flex gap-8">
                <Button
                  onClick={e => {
                    closePromptBarang(e);
                  }}
                >
                  Batal
                </Button>
                <StatedRangeButton state={promptInputState} />
                <Button onClick={e => masukkanKeranjang(e, itemDataPrompt)}>
                  Keranjang <i className="fa-solid fa-cart-shopping"></i>
                </Button>
              </div>
            </div>
          </div>
        </PopupBarang>
      ) : (
        <></>
      )}
    </div>
  </>;
}
