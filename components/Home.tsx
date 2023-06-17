import IDataBarang from "@/interfaces/DataBarang";
import { getCookies } from "cookies-next";
import { TmpCookiesObj } from "cookies-next/lib/types";
import React from "react";
import PopupBarang from "@/material/PopupBarang";
import Button from "@/material/Button";
import StatedRangeButton from "@/material/StatedRangeButton";
import { useRouter } from "next/router";
import Head from "next/head";
import { faCartShopping, faStar, faStore } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import manipulateURL from "@/lib/urlcontroller";

export interface IHomeProps {
  stateBarang: IDataBarang[];
  searchMode: boolean;
}

export default function HOme({ stateBarang, searchMode }: IHomeProps): JSX.Element {
  const earlyAnimation: any = React.useRef<null>(null);
  const [userdata, setUserdata]: any = React.useState<TmpCookiesObj>();
  const [itemDataPrompt, setItemDataPrompt]: any =
    React.useState<IDataBarang>();
  const [promptToggle, setPromptToggle]: any = React.useState<boolean>(false);
  const header: React.RefObject<HTMLObjectElement> = React.useRef(null);
  const contentBarang: React.RefObject<HTMLObjectElement> = React.useRef(null);
  const mainContent: React.RefObject<HTMLObjectElement> = React.useRef(null);
  const promptBarang: React.RefObject<HTMLDivElement> = React.useRef(null);
  const promptInputState: any = React.useState<number>(0);

  const queryBarang = useRouter().query["barang"];

  React.useEffect((): void => {
    manipulateURL("home", "Elyx Store - Home");

    (async (): Promise<any> => {
      let childrens: HTMLCollection = contentBarang.current?.children!;
      for (let i: number = 0; i < childrens.length!; i++) {
        childrens[i].classList.add("opacity-1");
        childrens[i].classList.add("animate__fadeInUp");
        await new Promise((resolve: Function): number =>
          setTimeout(resolve, 150)
        );
      }

      childrens = header.current?.children!;
      for (let i: number = 0; i < childrens?.length; i++) {
        childrens[i].classList.add("animate__fadeInUp");
        await new Promise((resolve: Function): number =>
          setTimeout(resolve, 150)
        );
      }
    })();

    earlyAnimation.current?.classList.add("animate__animated");
    earlyAnimation.current?.classList.add("animate__fadeInUp");
    earlyAnimation.current?.classList.add("animate__faster");

    setUserdata(JSON.parse(decodeURIComponent(getCookies().userdata!)));
  }, []);

  const promptBarangHandler: Function = (e: any, item: IDataBarang): void => {
    setItemDataPrompt(item);
    setPromptToggle(true);
  };

  const masukkanKeranjang: Function = (e: any, data: any): void => {
    if (data.stok == 0) alert("Stok Habis!");
    else if (promptInputState[0] > 0) {
      if (data.stok - promptInputState[0] < 0) alert("Melebihi Batas Stok");
      else
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
          .then((res): Promise<any> => {
            closePromptBarang(MouseEvent);
            return res.json();
          })
          .catch((err: Error): void => console.error(err));
    } else alert("Minimal 1 Bos!!!");
  };

  const closePromptBarang: Function = (e: any): void => {
    (async (): Promise<any> => {
      promptBarang.current!.classList.remove("overlay");
      promptBarang.current!.classList.add("overlay-reverse");
      await new Promise((resolve: Function) => setTimeout(resolve, 300));
      promptInputState[1](0);
      setPromptToggle(false);
      // console.log("removed");
    })();
  };

  return <>
    <Head>
      <title>Elyx Store - Store</title>
    </Head>
    <div className="text-white w-full mb-4" ref={mainContent}>
      {stateBarang.length > 0 && queryBarang != "" ?
        <h1 className="text-center mt-7 font-semibold animate__animated animate__fadeIn">
          Menurut Hasil pencarian - {queryBarang} ({stateBarang.length})
        </h1> : <></>
      }
      <div
        ref={contentBarang}
        className="flex justify-center gap-3 mt-5 flex-wrap pb-1 px-2"
      >
        {stateBarang.length == 0 ?
          <h1>
            Tidak ada hasil dari pencarian{" "}
            <b>{queryBarang}</b>
          </h1> : <></>
        }
        {stateBarang.map((item: IDataBarang) => {
          return (
            <div
              key={item._id}
              className="snap-start animate__animated opacity-0 cursor-pointer inline-block bg-[#ffffff13] rounded-xl backdrop-blur-3xl w-44 p-3"
              onClick={e =>
                promptBarangHandler(e, {
                  harga: item.harga,
                  nama: item.nama,
                  terjual: "???",
                  stok: item.stok,
                  rate: item.rate,
                  toko: item.toko,
                  gambar: item.gambar,
                  kode: item._id,
                  deskripsi: item.deskripsi,
                })
              }
            >
              <div className="h-auto aspect-square flex justify-center items-center">
                <img className="w-full" src={item.gambar} alt="" />
              </div>
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
                  <FontAwesomeIcon icon={faStore} className="mr-1"></FontAwesomeIcon>
                  {item.toko}
                </p>
                <p className="text-xs font-light flex items-center opacity-70 mt-1">
                  <FontAwesomeIcon icon={faStar} className="mr-1"></FontAwesomeIcon> {item.rate}{" "}
                  | Terjual {item.stok}+
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {promptToggle ? (
        <PopupBarang
          reference={promptBarang}
          toggleState={[promptToggle, setPromptToggle]}
          closePromptBarangFn={closePromptBarang}
        >
          <div className="flex h-full">
            <div className="h-[80vh] flex justify-center items-center max-h-[80vh] aspect-square m-2 rounded-md">
              <img className="w-full" src={itemDataPrompt.gambar} alt="" />
            </div>
            <div className="p-4 ml-2 flex flex-col justify-between">
              <div>
                <h1 className="font-semibold text-xl mb-2">
                  {itemDataPrompt.nama}
                </h1>
                <p className="font-light text-sm opacity-90">
                  Terjual {itemDataPrompt.terjual}+{" "}
                  <FontAwesomeIcon icon={faStar} className="mr-1 ml-2" />
                  {itemDataPrompt.rate}
                  <span className="ml-3">Stok {itemDataPrompt.stok}</span>
                </p>
                <p className="font-semibold text-2xl mt-3">
                  Rp
                  {itemDataPrompt.harga
                    .toString()
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
                </p>
                <div className="mt-4 flex items-center">
                  <FontAwesomeIcon icon={faStore} className="mr-1"></FontAwesomeIcon>
                  <p>{itemDataPrompt.toko}</p>
                </div>
                <div
                  className="mt-4 font-light overflow-y-scroll"
                  style={{
                    maxHeight: `calc(100vh - 24rem)`, // adjust the value according to your button's height and the parent div's padding
                  }}
                  dangerouslySetInnerHTML={{
                    __html: itemDataPrompt.deskripsi.replace(/\n/g, "<br />"),
                  }}
                ></div>
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
                  Keranjang <FontAwesomeIcon icon={faCartShopping} />
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
