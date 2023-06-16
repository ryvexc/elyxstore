import React, { MouseEventHandler } from "react";
import Background from "@/components/Background";

export default function Welcome(): JSX.Element {
  const lanjutkanButton: React.RefObject<HTMLObjectElement> =
    React.useRef<HTMLObjectElement>(null);
  const mainPage: React.RefObject<HTMLObjectElement> =
    React.useRef<HTMLObjectElement>(null);

  React.useEffect((): void => {
    document.title = "Welcome";
    async function animate(): Promise<any> {
      await new Promise((resolve: Function): number =>
        setTimeout(resolve, 3000)
      );
      lanjutkanButton.current!.classList.remove("h-0");
      lanjutkanButton.current!.classList.add("h-7");
      lanjutkanButton.current!.classList.add("mt-6");
    }
    animate();
  }, []);

  const handleRedirect: Function = async (e: any): Promise<any> => {
    await new Promise((resolve: Function): number => setTimeout(resolve, 500));
    mainPage.current!.classList.add("animate__fadeOut");
    window.location.href = "/login";
  };

  return (
    <div ref={mainPage} className="animate__animated">
      <Background className="animate__animated animate__fadeIn" />
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="animate__animated animate__fadeInUp mb-1 font-bold text-2xl text-white duration-1000">
          Welcome!
        </h1>
        <p className="animate__animated animate__fadeIn animate__delay-1s font-light text-base tracking-wide text-white duration-1000">
          Welcome to Modul 12-13 Arif Kurniawan!
        </p>
        <p
          className="animate-bounce animate__animated animate__fadeIn animate__delay-3s hover:cursor-pointer h-0 overflow-hidden duration-1000 text-[#3300ec]"
          ref={lanjutkanButton}
          onClick={(e: any) => handleRedirect(e)}
        >
          Lanjutkan &gt;
        </p>
      </div>
    </div>
  );
}
