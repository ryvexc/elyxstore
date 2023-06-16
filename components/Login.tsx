import React from "react";
import Heading from "./Heading";
import Button from "@/material/Button";
import Head from "next/head";
import Background from "./Background";

// prettier-ignore
export default function Login(): JSX.Element {
  const closingWindow: React.RefObject<HTMLObjectElement> = React.useRef<HTMLObjectElement>(null);
  const signInWindow: React.RefObject<HTMLObjectElement> = React.useRef<HTMLObjectElement>(null);
  const signUpWindow: React.RefObject<HTMLObjectElement> = React.useRef<HTMLObjectElement>(null);

  const handleDaftar: Function = (expand: boolean): void => {
    if (expand) {
      closingWindow.current!.style.left = "0";
      signInWindow.current!.style.opacity = "0";
      signUpWindow.current!.style.opacity = "1";
    } else {
      closingWindow.current!.style.left = "50%";
      signInWindow.current!.style.opacity = "1";
      signUpWindow.current!.style.opacity = "0";
    }
  }

  return <>
    <Head>
      <title>Elyx Store - Login</title>
    </Head>
    <Background></Background>
    <div className="animate__animated animate__fadeInDown h-screen w-screen flex justify-center items-center">
      <div className="overflow-hidden flex max-w-[900px] w-[80vw] h-[80vh] bg-[#ffffff13] rounded-xl backdrop-blur-3xl">
        <div ref={closingWindow} className="z-[1] p-7 w-6/12 left-2/4 h-full bg-[#ffffff13] absolute duration-500"></div>

        <div ref={signInWindow} className="duration-300 p-14 w-6/12 h-full flex justify-center items-center opacity-100">
          <form autoComplete="off" action="/api/auth" method="POST">
            <Heading>Selamat Datang!</Heading>
            <p className="text-xs font-light mb-8 text-white">Selamat Datang! Silahkan masukkan akun anda.</p>
            <div className="relative w-full mb-4 group">
              <input type="text" name="username" className="duration-200 block py-2.5 px-0 w-full text-sm text-[#ffffffaa] bg-transparent border-0 border-b-2 border-[#ffffff6f] appearance-none dark:text-[#ffffffc6] dark:focus:border-white focus:outline-none focus:ring-0 focus:border-white peer" placeholder=" " required />
              <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-[#ffffffaa] duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Username
              </label>
            </div>
            <div className="relative w-full mb-4 group">
              <input type="password" name="password" className="duration-200 block py-2.5 px-0 w-full text-sm text-[#ffffffaa] bg-transparent border-0 border-b-2 border-[#ffffff6f] appearance-none dark:text-[#ffffffc6] dark:focus:border-white focus:outline-none focus:ring-0 focus:border-white peer" placeholder=" " required />
              <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-[#ffffffaa] duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Password
              </label>
            </div>
            <Button type="submit">Masuk</Button>
            <p className="text-xs font-light mt-3 text-white">Tidak punya akun? <span className="hover:cursor-pointer hover:text-blue-400 duration-300 underline underline-offset-3 text-blue-500" onClick={(e: any) => handleDaftar(true)}>Daftar</span></p>
          </form>
        </div>

        <div ref={signUpWindow} className="duration-300 p-14 w-6/12 h-full flex justify-center items-center opacity-0">
          <form autoComplete="off" action="/api/register" method="POST">
            <Heading>Daftar</Heading>
            <p className="text-xs font-light mb-8 text-white">Bantu kami untuk mengidentifikasi data diri anda.</p>
            <div className="relative w-full mb-4 group">
              <input type="text" name="namalengkap" className="duration-200 block py-2.5 px-0 w-full text-sm text-[#ffffffaa] bg-transparent border-0 border-b-2 border-[#ffffff6f] appearance-none dark:text-[#ffffffc6] dark:focus:border-white focus:outline-none focus:ring-0 focus:border-white peer" placeholder=" " required />
              <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-[#ffffffaa] duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Nama Lengkap
              </label>
            </div>
            <div className="relative w-full mb-4 group">
              <input type="text" name="username" className="duration-200 block py-2.5 px-0 w-full text-sm text-[#ffffffaa] bg-transparent border-0 border-b-2 border-[#ffffff6f] appearance-none dark:text-[#ffffffc6] dark:focus:border-white focus:outline-none focus:ring-0 focus:border-white peer" placeholder=" " required />
              <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-[#ffffffaa] duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Username
              </label>
            </div>
            <div className="relative w-full mb-4 group">
              <input type="password" name="password" className="duration-200 block py-2.5 px-0 w-full text-sm text-[#ffffffaa] bg-transparent border-0 border-b-2 border-[#ffffff6f] appearance-none dark:text-[#ffffffc6] dark:focus:border-white focus:outline-none focus:ring-0 focus:border-white peer" placeholder=" " required />
              <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-[#ffffffaa] duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Password
              </label>
            </div>
            <button className="hover:bg-white hover:text-black duration-200 bg-transparent border border-[#ffffffaa] text-[#ffffffaa] rounded-md w-full h-9 mt-8">Daftar</button>
            <p className="text-xs font-light mt-3 text-white">Mempunyai akun? <span className="hover:cursor-pointer hover:text-blue-400 duration-300 underline underline-offset-3 text-blue-500" onClick={(e: any) => handleDaftar(false)}>Masuk</span></p>
          </form>
        </div>
      </div>
    </div>
  </>
}
