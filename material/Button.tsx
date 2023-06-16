import IButtonProps from "@/interfaces/ButtonProps";
import { MouseEventHandler } from "react";

export default function Button({
  className,
  children,
  type,
  role,
  onClick,
}: IButtonProps): JSX.Element {
  const clickHandler: MouseEventHandler<HTMLButtonElement> = (e: any): void => {
    if (onClick) onClick(e);
  };

  return (
    <button
      type={type || "button"}
      className={`${className} hover:bg-white hover:text-black duration-200 bg-transparent border border-[#ffffffaa] text-[#ffffffaa] rounded-md w-full h-9`}
      onClick={clickHandler}
    >
      {children}
    </button>
  );
}
