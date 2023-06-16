import { ReactNode } from "react";

export interface IHeadingProps {
  className?: string;
  children?: ReactNode;
}

export default function Heading({
  className = "",
  children,
}: IHeadingProps): JSX.Element {
  return (
    <h1 className={`text-white font-semibold text-2xl ${className}`}>
      {children}
    </h1>
  );
}
