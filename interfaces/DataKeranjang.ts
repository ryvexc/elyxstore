export default interface IDataKeranjang {
  _id: string;
  username: string;
  kodebrg: string;
  nama: string;
  harga: number;
  jumlah: number;
  subtotal: number;
  stok?: number;
  gambar: string;
}
