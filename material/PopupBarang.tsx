import React from "react";
import "@fortawesome/fontawesome-svg-core/styles.css";

interface IPopupBarang {
  children: any;
  toggleState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  reference: React.RefObject<HTMLDivElement>;
  closePromptBarangFn: any
}

export default function PopupBarang({
  children,
  toggleState,
  reference,
  closePromptBarangFn
}: IPopupBarang): JSX.Element {
  const handleEscOnPress = (e: any) => {
    if (e.key === "Escape") {
      closePromptBarangFn();
    }
  }

  React.useEffect(() => {
    window.addEventListener('keydown', handleEscOnPress);

    return () => window.removeEventListener('keydown', handleEscOnPress);
  }, []);

  return (
    <>
      {toggleState[0] ? (
        <div
          ref={reference}
          className="duration-300 backdrop-blur-3xl overlay fixed top-0 left-0 w-screen h-screen flex justify-center bg-[#00000062] items-center"
        >
          <div className="inline-block w-5/6 h-5/6 rounded-xl">{children}</div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}
