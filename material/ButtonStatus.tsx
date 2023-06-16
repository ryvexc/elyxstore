export default function ButtonStatus({ title }: any): JSX.Element {
  const primary_color = `text-${title[1]}-500`;

  return <p className={`text-xs p-1 rounded-sm`} style={{ color: title[1] }}>{title[0]}</p>
}
