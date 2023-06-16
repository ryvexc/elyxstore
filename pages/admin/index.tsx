import Background from "@/components/Background";
import Beranda from "@/components/Beranda";
import Keranjang from "@/components/Keranjang";
import { getCookies } from "cookies-next";
import { TmpCookiesObj } from "cookies-next/lib/types";
import React from "react";
import Home from "@/components/Home";
import Profile from "@/components/Profile";
import InputCari from "@/material/InputCari";
import Riwayat from "@/components/Riwayat";
import IDataBarang from "@/interfaces/DataBarang";
import Admin from "@/components/Admin";

export async function getServerSideProps({ query }: any) {
  const barang: string = query.barang || "";

  return {
    props: {
      barang,
    },
  };
}

export default function Index({ barang }: { barang: string }) {
  const [content, setContent]: any = React.useState<JSX.Element>();
  const [dataBarang, setDataBarang]: any = React.useState<IDataBarang[]>([]);
  const [userdata, setUserdata]: any = React.useState<TmpCookiesObj>();

  React.useEffect(() => {
    fetch(`/api/dataBarang?barang=${barang}`)
      .then((res: Response): Promise<any> => res.json())
      .then((data: any): void => {
        setContent(<Admin />);
        setDataBarang(data);
      })
      .catch((err: Error): void => console.error(err));
    setUserdata(JSON.parse(decodeURIComponent(getCookies().userdata!)));
  }, []);

  React.useEffect(() => {
    fetch(`/api/updatelastsearch?lastsearch=${barang}&username=${userdata?.username}`)
      .catch(err => console.error(err));
  }, [userdata])

  return (
    <div className="w-screen">
      <Background className="animate__animated animate__fadeIn" />
      <div className="z-20 fixed animate__animated animate__fadeIn h-14 w-full flex justify-between bg-[#ffffff13] backdrop-blur-3xl">
        <div id="left-menu" className="pl-3 flex justify-center items-center">
          <a href="/home" className="text-lg font-semibold tracking-wide">
            Elyx Store
          </a>
        </div>
        <div id="center-menu" className="flex gap-x-8 items-center">
          <InputCari
            action="/home"
            method="GET"
            lastsearch={barang}
            submitEvent={(e: any) => {
              fetch(`/api/updatelastsearch?lastsearch=${barang}&username=${userdata?.username}`);
            }}
          />
          <p
            className="text-white cursor-pointer"
            onClick={e => setContent(<Keranjang />)}
          >
            <i className="fa-solid fa-cart-shopping"></i>
          </p>
          <p
            className="text-white cursor-pointer"
            onClick={e => setContent(<Riwayat />)}
          >
            <i className="fa-solid fa-clock-rotate-left"></i>
          </p>
          <p
            className="text-white cursor-pointer"
            onClick={e => setContent(<Home stateBarang={dataBarang} searchMode={!!barang} />)}
          >
            <i className="fa-solid fa-shop"></i>
          </p>
          <p
            className="text-white cursor-pointer"
            onClick={e => setContent(<Beranda />)}
          >
            <i className="fa-solid fa-house"></i>
          </p>
          <p
            className="text-white cursor-pointer"
            onClick={e => setContent(<Admin />)}
          >
            <i className="fa-solid fa-tag"></i>
          </p>
          <p
            className="text-white cursor-pointer"
            onClick={e => setContent(<Profile />)}
          >
            <i className="fa-solid fa-user"></i>
          </p>
        </div>
        <div
          id="right-menu"
          className="cursor-pointer flex justify-center items-center pr-3 gap-3 font-semibold"
          onClick={(e: any): void => setContent(<Profile />)}
        >
          <p className="text-white tracking-wide">
            {userdata?.namalengkap?.split(" ")[0]}
          </p>
          <img
            className="w-8 h-8 rounded-full"
            src="default-profile.jpg"
            alt=""
          />
        </div>
      </div>
      <div className="flex justify-center w-screen h-auto">
        <div className="mt-14 flex justify-center flex-col w-screen items-center">
          {content}
        </div>
      </div>
    </div>
  );
}
