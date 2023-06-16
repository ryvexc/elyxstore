import Horizontal from "../material/Horizontal";
import React from "react";
import getdate from "@/utils/getdate";
import IDataBarang from "@/interfaces/DataBarang";
import IFetchResponse from "@/interfaces/FetchResponse";
import Background from "./Background";

export default function FormJual(): JSX.Element {
  const [data, setData]: any = React.useState<IDataBarang[]>([]);
  const [namaBarang, setNamaBarang]: any = React.useState<string>("");
  const [harga, setHarga]: any = React.useState<string>("");
  const [serverError, setServerError]: any = React.useState<boolean>(false);

  const inputKodeBarang: React.RefObject<HTMLInputElement> =
    React.useRef<HTMLInputElement>(null);

  React.useEffect((): void => {
    fetch("/api/dataBarang", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then(async (response: IFetchResponse): Promise<any> => {
        if (response.ok) {
          setData(await response.json());
          setServerError(false);
        } else {
          setServerError(true);
        }
      })
      .catch((e: Error): void => console.error(e));
  }, []);

  React.useEffect((): void => {
    setNamaBarang(serverError ? "Server Error" : "");
    setHarga(serverError ? "Server Error" : "");
  }, [serverError]);

  const cariData = (): void => {
    serverError && alert("Server Error or might be Maintenanced.");
    const idCode: string = inputKodeBarang.current!.value;
    const dataBarang: IDataBarang[] = data.filter(
      (barang: IDataBarang) => barang.kodebrg == idCode
    );
    setNamaBarang(dataBarang[0]?.nama);
    setHarga(dataBarang[0]?.harga.toString());
  };

  // prettier-ignore
  return (<>
		<Background className="animate__animated animate__fadeIn" />
		<form className="animate__animated animate__fadeIn" method='POST' action='127.0.0.1:8111/api/tambahtransaksi'>
			<h1 className='text-blue-400 font-semibold text-[30px]'>
				Transaksi Penjualan
			</h1>
			<p className='text-[16px]'>Tanggal Transaksi: {getdate()}</p>
			<Horizontal />
			<table>
				<tbody>
					<tr>
						<td>Kode Barang</td>
						<td>
							<input
								name='kodebarang'
								ref={inputKodeBarang}
								type='text'
								className='border border-black px-2 p-1 w-fill'></input>
						</td>
						<td>
							<button
								type='button'
								onClick={(e) => cariData()}
								role='button'
								className='bg-blue-400 px-2 py-1 text-white'>
								Cari Barang
							</button>
						</td>
					</tr>
					<tr>
						<td>Nama Barang</td>
						<td colSpan={2}>
							<input
								name='namabarang'
								value={namaBarang}
								readOnly
								type='text'
								className='border border-black px-2 p-1 w-full'></input>
						</td>
					</tr>
					<tr>
						<td>Harga</td>
						<td colSpan={2}>
							<input
								name='hargabarang'
								value={harga}
								readOnly
								type='text'
								className='border border-black px-2 p-1 w-full'></input>
						</td>
					</tr>
					<tr>
						<td>Jumlah</td>
						<td>
							<input
								name='jumlahbarang'
								type='number'
								min='0'
								className='border border-black px-2 p-1 w-fill'></input>
						</td>
						<td>
							<button
								type='submit'
								className='bg-blue-400 px-2 py-1 w-full text-white'>
								Tambah
							</button>
						</td>
					</tr>
				</tbody>
			</table>
			<Horizontal />
		</form>
	</>);
}
