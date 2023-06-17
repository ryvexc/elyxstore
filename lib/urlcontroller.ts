export default function manipulateURL(url: string, title: string): void {
  if (typeof history.replaceState != "undefined") {
    var obj = {
      Title: title,
      Url: url,
    };
    history.replaceState(obj, obj.Title, obj.Url);
  }
}
