import React, { use } from "react";
import Background from "@/components/Background";
import { TmpCookiesObj } from "cookies-next/lib/types";
import { getCookies } from "cookies-next";

export default function Index({ title }: any): JSX.Element {
  const inputFileRef: any = React.useRef(null);
  const [gambarSrc, setGambarSrc] = React.useState("");
  const [isGambarLoaded, setIsGambarLoaded] = React.useState(false);
  const [userdata, setUserdata] = React.useState<TmpCookiesObj>();

  React.useEffect(() => {
    inputFileRef.current!.onchange = () => {
      const file = inputFileRef.current!.files[0];
      console.log(inputFileRef.current!.files[0]);

      const reader = new FileReader();

      reader.addEventListener("load", (readerEvent: any) => {
        const blobData = readerEvent.target.result;
        // Use the blobData here or pass it to another function
        console.log(blobData);
        setGambarSrc(blobData);
        setIsGambarLoaded(true)
      });

      reader.readAsDataURL(file);
    }

    setUserdata(JSON.parse(decodeURIComponent(getCookies().userdata!)));
  }, []);

  React.useEffect(() => console.log(userdata), [userdata]);
  return <form action="/api/tambahBarang" method="POST">
    <Background></Background>
    <div className="w-full justify-center">
      <h1 className="text-xl text-center my-10 font-medium">Tambah Item - Toko <span className="font-bold text-2xl">{userdata ? userdata.nama : "(Loading)"}</span></h1>
      <div className="w-full grid px-24 gap-16 grid-cols-2">
        <div className="w-full">
          <div className="mb-6">
            <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nama Barang</label>
            <input type="text" id="nama" name="nama" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Masukkan Nama Barang" required />
          </div>

          <div className="mb-6">
            <label htmlFor="harga" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Harga</label>
            <input type="number" id="harga" name="harga" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Masukkan Harga" required />
          </div>

          <div className="mb-6">
            <label htmlFor="stok" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Stok</label>
            <input type="number" id="stok" name="stok" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Masukkan Stok" required />
          </div>

          <div className="mb-6">
            <label htmlFor="toko" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Toko Anda</label>
            <input type="number" id="toko" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" readOnly placeholder={userdata ? userdata.nama : "(Loading)"} />
          </div>

          <button name="toko" value={userdata ? userdata.nama : "(Loading)"} className="mt-5 w-full relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
            <span className="w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Tambah
            </span>
          </button>
        </div>

        <div className="w-full">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload Gambar</label>
          <div className="flex items-center justify-center w-full mb-7">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-transparent dark:border-gray-600 dark:hover:border-gray-500">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
              </div>
              <input ref={inputFileRef} id="dropzone-file" type="file" className="hidden" required />
              <input value={gambarSrc} name="dataGambar" type="hidden" />
            </label>
          </div>

          <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Deskripsi</label>
          <textarea name="deskripsi" id="message" rows={4} className="mb-6 block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Tuliskan Deskripsi..." required></textarea>

          {isGambarLoaded ?
            <figure className="w-full mb-14">
              <img className="h-auto max-w-full rounded-lg" src={gambarSrc} alt="image description" />
              <figcaption className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">Image Preview</figcaption>
            </figure> : <></>
          }
        </div>
      </div>
    </div>
  </form>
}
