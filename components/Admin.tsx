import Head from "next/head";
import React from "react";
import Horizontal from "../material/Horizontal";
import IFetchResponse from "@/interfaces/FetchResponse";
import ButtonStatus from "@/material/ButtonStatus";
import manipulateURL from "@/database/urlcontroller";
import { getCookies } from "cookies-next";

export interface IDataHistory {
  _id: string;
  username: string;
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

export default function Admin({ className }: IRiwayatProps): JSX.Element {
  const [history, setHistory]: any = React.useState<IDataHistory[]>([]);
  const [loading, setLoading]: any = React.useState<boolean>(true);
  const [serverError, setServerError]: any = React.useState<boolean>(false);
  const userdata = JSON.parse(decodeURIComponent(getCookies().userdata!));
  const asyncAnimation: React.RefObject<HTMLObjectElement> =
    React.useRef<HTMLObjectElement>(null);
  const asyncAnimation2: React.RefObject<HTMLObjectElement> =
    React.useRef<HTMLObjectElement>(null);

  const getKeranjangTotal = (_data: any[] = history): number => {
    // console.log(_data);
    let total: number = 0;
    _data.forEach((data: any) => (total += data?.subtotal));
    return total;
  };

  const mainContent: React.RefObject<HTMLObjectElement> =
    React.useRef<HTMLObjectElement>(null);
  const mainContent2: React.RefObject<HTMLObjectElement> =
    React.useRef<HTMLObjectElement>(null);

  const translateStatus = (status: string): string[] => {
    if (status == "BTL") return ["Dibatalkan", "#d4343c"];
    else if (status == "KFM") return ["Menuggu Konfirmasi", "#ff9966"];
    else if (status == "SLS") return ["Selesai", "#99cc33"];
    else if (status == "PRS") return ["Diproses", "#ff9966"];
    return ["", ""];
  }

  const fetchDataKeranjang = async (): Promise<any> => {
    await fetch(`/api/admin`, {
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
    manipulateURL("/admin", "Elyx Store - Admin");

    mainContent.current?.classList.add("animate__animated");
    mainContent.current?.classList.add("animate__fadeInUp");
    mainContent.current?.classList.add("animate__faster");

    mainContent2.current?.classList.add("animate__animated");
    mainContent2.current?.classList.add("animate__fadeInUp");
    mainContent2.current?.classList.add("animate__faster");

    let childrens: HTMLCollection = asyncAnimation.current?.children!;
    (async (): Promise<any> => {
      for (let i = 0; i < childrens.length!; i++) {
        childrens[i].classList.add("animate__animated");
        childrens[i].classList.add("animate__fadeInDown");
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    })();

    let childrens2: HTMLCollection = asyncAnimation2.current?.children!;
    (async (): Promise<any> => {
      for (let i = 0; i < childrens2.length!; i++) {
        childrens2[i].classList.add("animate__animated");
        childrens2[i].classList.add("animate__fadeInDown");
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    })();

    fetchDataKeranjang()
  }, []);

  const handleButtonChange = async (e: any, invoice: string, username: string, status: string) => {
    await fetch('/api/admincontrol', {
      method: "POST",
      body: JSON.stringify({
        invoice: invoice,
        username: username,
        status: status
      }),
      headers: { "Content-Type": "application/json" },
    })

    location.reload();
  }

  return <>
    <Head>
      <title>Elyx Store - Admin</title>
    </Head>
    <div className={`${className} w-4/5 duration-1000`} ref={mainContent}>
      <div
        ref={asyncAnimation}
        className="p-3 pb-1 m-3 bg-[#ffffff13] duration-1000 rounded-md backdrop-blur-3xl"
      >
        <p className="opacity-0 font-semibold text-[18px]">
          Dalam Proses ({history.filter((item: IDataHistory) => item.status != "SLS").length})
        </p>
        <Horizontal color="opacity-0 bg-[#d4d4d4ca]" />
        <div className="opacity-0 flex flex-col gap-y-4 animasiHeight overflow-x-hidden">
          {history.length == 0 &&
            (!loading ? (
              <h1 className="text-center font-light">
                Tidak ada pesanan
              </h1>
            ) : (
              <h1 className="text-center font-light">Memuat...</h1>
            ))}
          {!serverError ? (
            history.filter((item: any) => item.status != "SLS").map((data: IDataHistory, index: number) => {
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
                      <div className="flex" key={barang._id}>
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
                  {/* <hr className="mx-2 my-2" /> */}
                  <div className="w-full flex justify-between items-center px-2">
                    <div>
                      <p className="text-sm">
                        <span className="opacity-80 text-xs">
                          Pengguna:{" "}
                        </span>
                        <span className="font-semibold text-base">
                          {data.username}
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="opacity-80 text-xs">
                          Income:{" "}
                        </span>
                        <span className="font-semibold text-lg">
                          Rp{" "}
                          {data.total
                            .toString()
                            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button className="text-red-500 border border-red-500 rounded-md p-1 px-3 duration-150 hover:border hover:border-red-500 hover:border-opacity-80 hover:text-white hover:bg-red-500 hover:bg-opacity-80" onClick={e => handleButtonChange(e, data._id, data.username, "BTL")}>Batalkan</button>
                      {data.status != "PRS" ?
                        <button className="text-orange-500 border border-orange-500 rounded-md p-1 px-3 duration-150 hover:border hover:border-orange-400 hover:border-opacity-80 hover:text-white hover:bg-orange-400 hover:bg-opacity-80" onClick={e => handleButtonChange(e, data._id, data.username, "PRS")}>Konfirmasi</button>
                        : <></>
                      }
                      {data.status != "KFM" ?
                        <button className="text-green-600 border border-green-600 rounded-md p-1 px-3 duration-150 hover:border hover:border-green-500 hover:border-opacity-80 hover:text-white hover:bg-green-500 hover:bg-opacity-80" onClick={e => handleButtonChange(e, data._id, data.username, "SLS")}>Selesaikan</button>
                        : <></>
                      }
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
      </div>

      <div
        ref={asyncAnimation2}
        className="p-3 pb-1 m-3 bg-[#ffffff13] duration-1000 rounded-md backdrop-blur-3xl"
      >
        <p className="opacity-0 font-semibold text-[18px]">
          Selesai ({history.filter((item: IDataHistory) => item.status == "SLS").length})
        </p>
        <Horizontal color="opacity-0 bg-[#d4d4d4ca]" />
        <div className="opacity-0 flex flex-col gap-y-4 animasiHeight overflow-x-hidden">
          {history.length == 0 &&
            (!loading ? (
              <h1 className="text-center font-light">
                Tidak ada pesanan
              </h1>
            ) : (
              <h1 className="text-center font-light">Memuat...</h1>
            ))}
          {!serverError ? (
            history.filter((item: any) => item.status == "SLS").map((data: IDataHistory, index: number) => {
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
                      <div className="flex" key={barang._id}>
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
                  <div className="w-full flex justify-end items-center px-2">
                    <p className="text-sm">
                      <span className="opacity-80 text-xs">
                        Income: {" "}
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
  </>
}
