export default function getDate(): string {
  return `${new Date().getDate()}/${new Date().getMonth() + 1}/${
    new Date().getFullYear() + 1
  }`;
}
