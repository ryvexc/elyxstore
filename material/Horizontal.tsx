import IHorizontalProps from "@/interfaces/HorizontalProps";

export default function Horizontal({
  color,
  className,
}: IHorizontalProps): JSX.Element {
  return (
    <div className={`h-1 ${className} ${color || "bg-black"} mt-4 mb-4`}></div>
  );
}
