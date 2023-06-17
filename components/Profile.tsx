import { getCookies } from "cookies-next";
import { TmpCookiesObj } from "cookies-next/lib/types";
import Button from "@/material/Button";
import React, { MouseEventHandler } from "react";
import "@/public/default-profile.jpg";
import manipulateURL from "@/lib/urlcontroller";
import Head from "next/head";
import Horizontal from "@/material/Horizontal";
import { ObjectId } from "mongodb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function Profile({ className }: any): JSX.Element {
  const [userdata, setUserdata]: any = React.useState<TmpCookiesObj>({});
  const [dataBarang, setDataBarang]: any = React.useState([]);
  const mainContent: React.RefObject<HTMLObjectElement> =
    React.useRef<HTMLObjectElement>(null);
  const asyncAnimation: React.RefObject<HTMLObjectElement> =
    React.useRef<HTMLObjectElement>(null);

  React.useEffect((): void => {
    manipulateURL("profile", "Elyx Store - Profile");

    setUserdata(JSON.parse(decodeURIComponent(getCookies().userdata!)));

    let childrens: HTMLCollection = mainContent.current?.children!;
    (async (): Promise<any> => {
      for (let i: number = 0; i < childrens.length!; i++) {
        childrens[i].classList.add("animate__animated");
        childrens[i].classList.add("animate__faster");
        childrens[i].classList.add("animate__fadeInDown");
        await new Promise((resolve: Function): number =>
          setTimeout(resolve, 150)
        );
      }
    })();

    fetch(`/api/dataBarang?toko=${JSON.parse(decodeURIComponent(getCookies().userdata!)).nama}&barang=`).then(response => response.json()).then(data => setDataBarang(data)).catch(error => console.error(error));
  }, []);

  const logoutHandler: MouseEventHandler<HTMLButtonElement> = (
    e: any
  ): void => {
    window.location.href = "/logout";
  };

  const deleteHandler = (
    e: any, id: ObjectId
  ): void => {
    fetch(`/api/deleteBarang?id=${id}`, {
      method: "POST",
      body: JSON.stringify({
        username: userdata.username,
        id: id,
      }),
      headers: { "Content-Type": "application/json" }
    },).then(res => res.json).catch(error => console.error(error));

    location.reload();
  };

  return <>
    <Head>
      <title>Elyx Store - Profile</title>
    </Head>
    <div className="w-4/5 animate__animated animate__fadeInUp animate__faster p-3 m-3 bg-[#ffffff13] rounded-md backdrop-blur-3xl">
      <div
        ref={mainContent}
        className="flex flex-col justify-center items-center my-4"
      >
        <img
          className="opacity-1 w-20 h-20 rounded-full duration-500 hover:w-28 hover:h-28"
          src="default-profile.jpg"
          alt=""
        />
        <p className="opacity-1 text-xl font-semibold mt-3 -mb-1">
          {userdata.nama}
        </p>
        <p className="opacity-1 text-sm font-light mb-2">{userdata.username}</p>
        <p className="text-gray-400">UID: {userdata._id}</p>
        <p className="opacity-0 text-center text-sm px-4 font-light">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Esse ratione
          voluptatum harum, praesentium
        </p>
      </div>
      <Button className="scale-90 w-4/5" onClick={(e: any) => logoutHandler(e)}>
        Logout
      </Button>
    </div>

    <div className={`${className} w-4/5 duration-1000`} ref={mainContent}>
      <div
        className="p-3 m-3 bg-[#ffffff13] duration-1000 rounded-md backdrop-blur-3xl"
      >
        <p className="opacity-1 font-semibold text-[18px]">
          Toko Anda ({dataBarang.length})
        </p>
        <Horizontal color="opacity-1 bg-[#d4d4d4ca]" />
        <div className="opacity-1 flex flex-col gap-y-4 animasiHeight overflow-x-hidden">
          {dataBarang.length == 0 ?
            <h1 className="text-center font-light">
              Tidak ada item di toko anda
            </h1>
            : <></>}

          {dataBarang.map((data: any, index: number) => {
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
                      <div className="flex items-center gap-6">
                        <FontAwesomeIcon icon={faPen} className="cursor-pointer hover:text-orange-500"
                          onClick={(e) => window.location.href = `/edit?kodebrg=${data._id}`}
                        />
                        <FontAwesomeIcon icon={faTrash}
                          className="hover:text-red-500 cursor-pointer mr-4"
                          aria-hidden="true"
                          onClick={(e: any): void =>
                            deleteHandler(e, data._id)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="w-full flex justify-end">
            <Button className="scale-90 w-40" onClick={() => window.location.href = "/tambah"}>
              Tambah
            </Button>
          </div>
        </div>
      </div>
    </div>
  </>;
}
