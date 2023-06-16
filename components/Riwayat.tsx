import React from "react";
import Horizontal from "../material/Horizontal";
import IFetchResponse from "@/interfaces/FetchResponse";
import { TmpCookiesObj } from "cookies-next/lib/types";
import { getCookies } from "cookies-next";
import ButtonStatus from "@/material/ButtonStatus";
import manipulateURL from "@/database/urlcontroller";
import Head from "next/head";

export interface IDataHistory {
  id: string;
  tanggal: string;
  detailTransaksi: string;
  total: number;
  nojual: number;
  gambar: Blob;
  nama: string;
  harga: number;
  dataBarang: [
    {
      nama: string;
      gambar: Blob;
      harga: number;
    }
  ];
  status: string;
}

export interface IRiwayatProps {
  className?: string;
}

export default function Riwayat({ className }: IRiwayatProps): JSX.Element {
  const [history, setHistory]: any = React.useState<IDataHistory[]>([]);
  const [loading, setLoading]: any = React.useState<boolean>(true);
  const [serverError, setServerError]: any = React.useState<boolean>(false);
  const [userdata, setUserdata]: any = React.useState<TmpCookiesObj>(
    JSON.parse(decodeURIComponent(getCookies().userdata!))
  );
  const asyncAnimation: React.RefObject<HTMLObjectElement> =
    React.useRef<HTMLObjectElement>(null);

  const mainContent: React.RefObject<HTMLObjectElement> =
    React.useRef<HTMLObjectElement>(null);

  const translateStatus = (status: string): string[] => {
    if (status == "BTL") return ["Dibatalkan", "#d4343c"];
    else if (status == "KFM") return ["Menuggu Konfirmasi", "#ff9966"];
    else if (status == "SLS") return ["Selesai", "#99cc33"];
    else if (status == "PRS") return ["Diproses", "#ff9966"];
    return ["", ""];
  }

  const fetchDataKeranjang = async (): Promise<any> => {
    await fetch(`/api/history?username=${userdata.username}`, {
      method: "get",
    } as RequestInit)
      .then(async (response: IFetchResponse): Promise<any> => {
        if (response.ok) {
          const awaitedResponse: any[] = await response.json();
          setHistory(awaitedResponse);
          setLoading(false);
        } else setServerError(true);
      })
      .catch((err: Error): void => console.error(err));
  };

  React.useEffect((): void => {
    manipulateURL("history", "Elyx Store - History");

    mainContent.current?.classList.add("animate__animated");
    mainContent.current?.classList.add("animate__fadeInUp");
    mainContent.current?.classList.add("animate__faster");

    let childrens: HTMLCollection = asyncAnimation.current?.children!;
    (async (): Promise<any> => {
      for (let i = 0; i < childrens.length!; i++) {
        childrens[i].classList.add("animate__animated");
        childrens[i].classList.add("animate__fadeInDown");
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    })();

    fetchDataKeranjang();
  }, []);

  return <>
    <Head>
      <title>Elyx Store - History</title>
    </Head>
    <div className={`${className} w-4/5 duration-1000`} ref={mainContent}>
      <div
        ref={asyncAnimation}
        className="p-3 pb-1 m-3 bg-[#ffffff13] duration-1000 rounded-md backdrop-blur-3xl"
      >
        <p className="opacity-0 font-semibold text-[18px]">
          History ({history.length})
        </p>
        <Horizontal color="opacity-0 bg-[#d4d4d4ca]" />
        <div className="opacity-0 flex flex-col gap-y-4 animasiHeight overflow-x-hidden">
          {history.length == 0 &&
            (!loading ? (
              <h1 className="text-center font-light">
                Tidak ada item dalam history
              </h1>
            ) : (
              <h1 className="text-center font-light">Memuat...</h1>
            ))}
          {!serverError ? (
            history.map((data: any, index: number) => {
              return (
                <div
                  className={`bg-white/10 w-full p-2 rounded-md h-auto animate__animated animate__fadeInLeft`}
                  key={index}
                >
                  <p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold ml-2">Pesanan </span>
                        <span className="text-xs ml-2">
                          {data.tanggal.split("T")[0]}
                        </span>
                        <span className="text-xs ml-2 opacity-60">
                          INV-{data._id}
                        </span>
                      </div>
                      <ButtonStatus title={translateStatus(data.status)}></ButtonStatus>
                    </div>
                  </p>
                  {data.dataBarang.map((barang: any, indexBarang: number) => {
                    return (
                      <div className="flex">
                        <div className="h-20 flex justify-center items-center max-h-20 aspect-square m-2 rounded-md">
                          <img className="w-full" src={barang.gambar} alt="" />
                        </div>
                        <div className="w-full p-2">
                          <p className="text-[16px]">{barang.nama}</p>
                          <p className="text-[10px]">
                            {
                              JSON.parse(data.detailTransaksi).barang[indexBarang]
                                .jumlahbeli
                            }{" "}
                            barang x{" Rp"}
                            {barang.harga
                              .toString()
                              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
                          </p>
                          <p className="text-sm mt-1 opacity-80">
                            <i className="fa-solid fa-store mr-1"></i>
                            {barang.toko}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div className="w-full flex justify-between items-center px-2">
                    <p className="text-xs opacity-80">{data.nojual}</p>
                    <p className="text-sm">
                      <span className="opacity-80 text-xs">
                        Total Belanja:{" "}
                      </span>
                      <span className="font-semibold text-lg">
                        Rp{" "}
                        {data.total
                          .toString()
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
                      </span>
                    </p>
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
      </div>
    </div>
  </>;
}
