import { MouseEventHandler } from "react";

export default interface IButtonProps {
  children: any;
  className?: string;
  type?: "button" | "reset" | "submit" | undefined;
  role?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}
