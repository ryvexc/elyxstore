import React from "react";
import Horizontal from "../material/Horizontal";
import getrawdate from "@/utils/getdate";
import IFetchResponse from "@/interfaces/FetchResponse";
import IDataKeranjang from "@/interfaces/DataKeranjang";
import Button from "@/material/Button";
import RangeButton from "@/material/RangeButton";
import { TmpCookiesObj } from "cookies-next/lib/types";
import { getCookies } from "cookies-next";

import Head from "next/head";
import manipulateURL from "@/database/urlcontroller";

export interface ITabelKeranjang {
  className?: string;
}

export default function Keranjang({
  className,
}: ITabelKeranjang): JSX.Element {
  const [keranjang, setKeranjang]: any = React.useState<IDataKeranjang[]>([]);
  const [loading, setLoading]: any = React.useState<boolean>(true);
  const [serverError, setServerError]: any = React.useState<boolean>(false);
  const [totalKeranjang, setTotalKeranjang]: any = React.useState<number>(0);
  const [userdata, setUserdata]: any = React.useState<TmpCookiesObj>(
    JSON.parse(decodeURIComponent(getCookies().userdata!))
  );
  const asyncAnimation: React.RefObject<HTMLObjectElement> =
    React.useRef<HTMLObjectElement>(null);

  const getKeranjangTotal: Function = (
    _data: IDataKeranjang[] = keranjang
  ): number => {
    // console.log(_data);
    let total: number = 0;
    _data.forEach((data: IDataKeranjang): number => (total += data?.subtotal));
    return total;
  };

  const deleteHandler: Function = (e: any, id: number): void => {
    fetch("/api/removekeranjang", {
      method: "POST",
      body: JSON.stringify({
        username: userdata.username,
        id: id,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res: Response): void => {
        if (res.ok) fetchDataKeranjang();
      })
      .catch((err: Error): void => console.error(err));
  };

  const mainContent: React.RefObject<HTMLObjectElement> =
    React.useRef<HTMLObjectElement>(null);

  const fetchDataKeranjang = async (): Promise<any> => {
    await fetch("/api/userkeranjang", {
      method: "post",
      body: JSON.stringify({
        username: userdata!.username,
      }), // Angrip Kurniawokwokwowokw
      headers: { "Content-Type": "application/json" },
    })
      .then(async (response: IFetchResponse): Promise<any> => {
        if (response.ok) {
          const awaitedResponse: IDataKeranjang[] = await response.json();
          setKeranjang(awaitedResponse);
          setTotalKeranjang(getKeranjangTotal(awaitedResponse));
          setLoading(false);
        } else setServerError(true);
      })
      .catch((err: Error): void => console.error(err));
  };

  React.useEffect((): void => {
    manipulateURL("cart", "Elyx Store - Cart");

    mainContent.current?.classList.add("animate__animated");
    mainContent.current?.classList.add("animate__fadeInUp");
    mainContent.current?.classList.add("animate__faster");

    let childrens: HTMLCollection = asyncAnimation.current?.children!;
    (async (): Promise<any> => {
      for (let i = 0; i < childrens.length!; i++) {
        childrens[i].classList.add("animate__animated");
        childrens[i].classList.add("animate__fadeInDown");
        await new Promise((resolve: Function): number =>
          setTimeout(resolve, 100)
        );
      }
    })();

    fetchDataKeranjang();
    setTotalKeranjang(getKeranjangTotal());
  }, []);

  const updateData = (id: string, jumlah: number, subtotal: number): void => {
    fetch("/api/updatekeranjang", {
      method: "post",
      body: JSON.stringify({
        id: id,
        jumlah: jumlah,
        subtotal: subtotal,
        username: userdata!.username,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res: Response): Promise<any> => res.json())
      .then((data: any): void => data)
      .catch((err: Error): void => console.error(err));
  };

  let time: NodeJS.Timer | number;
  const awaitNewButtonState: Function = (buttonId: number): void => {
    const action: Function = (): void => {
      setTotalKeranjang(
        eval(
          (
            keranjang.map(
              (item: any): number => item.jumlah * item.harga
            ) as number[]
          ).join(" + ")
        )
      );
      updateData(
        keranjang[buttonId]._id,
        keranjang[buttonId].jumlah,
        keranjang[buttonId].harga * keranjang[buttonId].jumlah
      );
      clearTimeout(time);
    };

    const resetTimer: Function = (): void => {
      clearTimeout(time);
      time = setTimeout(action, 2000);
    };

    resetTimer();
  };

  return <>
    <Head>
      <title>Elyx Store - Cart ({keranjang.length})</title>
    </Head>
    <div className={`${className} w-4/5 duration-1000`} ref={mainContent}>
      <div
        ref={asyncAnimation}
        className="p-3 m-3 bg-[#ffffff13] duration-1000 rounded-md backdrop-blur-3xl"
      >
        <p className="opacity-0 font-semibold text-[18px]">
          Keranjang ({keranjang.length})
        </p>
        <Horizontal color="opacity-0 bg-[#d4d4d4ca]" />
        <div className="opacity-0 flex flex-col gap-y-4 animasiHeight overflow-x-hidden">
          {keranjang.length == 0 &&
            (!loading ? (
              <h1 className="text-center font-light">
                Tidak ada item dalam keranjang
              </h1>
            ) : (
              <h1 className="text-center font-light">Memuat...</h1>
            ))}
          {!serverError ? (
            keranjang.map((data: IDataKeranjang, index: number) => {
              return (
                <div
                  className={`w-full h-auto animate__animated animate__fadeInLeft`}
                  key={data._id}
                >
                  <div className="flex gap-4">
                    <div className="h-20 flex justify-center items-center max-h-20 aspect-square m-2 rounded-md">
                      <img src={data.gambar} alt="" className="w-full" />
                    </div>
                    <div className="w-full">
                      <p className="text-[16px]">{data.nama}</p>
                      <p className="text-[10px]">Sisa {data.stok}</p>
                      <div className="mt-3 flex justify-between items-center">
                        <p className="font-semibold text-[17px]">
                          Rp
                          {data.harga
                            .toString()
                            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
                        </p>
                        <div className="flex items-center gap-4">
                          <p className="text-xs">
                            total:{" "}
                            <span className="font-semibold">
                              Rp
                              {(
                                keranjang[index].jumlah * keranjang[index].harga
                              )
                                .toString()
                                .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
                            </span>
                          </p>
                          <i
                            className="fa fa-trash hover:text-red-500 cursor-pointer"
                            aria-hidden="true"
                            onClick={(e: any): void =>
                              deleteHandler(e, data._id)
                            }
                          ></i>
                          <RangeButton
                            onClick={(e: any): void =>
                              awaitNewButtonState(index)
                            }
                            databaseValue={keranjang[index].jumlah}
                            state={keranjang}
                            setState={setKeranjang}
                            index={index}
                            updateData={updateData}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <tr>
              <td colSpan={5}>Server Error</td>
            </tr>
          )}
        </div>
        <Horizontal color="opacity-0 bg-[#d4d4d4ca]" className="mb-4" />
        <p className={`opacity-1 ${keranjang.length > 0 ? "mb-4" : "mb-0"}`}>
          Total{"  "}
          <span className="font-semibold">
            Rp
            {totalKeranjang
              .toString()
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
          </span>
        </p>
        <form className="opacity-0" action="/api/simpantransaksi" method="POST">
          <input type="hidden" value={userdata.username} name="username" />
          <input type="hidden" value={getrawdate()} name="transactionDate" />
          <input
            type="hidden"
            name="detailTransaksi"
            value={JSON.stringify({
              barang: keranjang.map((item: IDataKeranjang) => {
                return { kodebrg: item.kodebrg, jumlahbeli: item.jumlah };
              }),
            })}
          />

          {keranjang.length > 0 ?
            <Button type="submit" className="w-auto px-3 mt-0">
              Checkout
            </Button> : <></>
          }
        </form>
      </div>
    </div>
  </>;
}
