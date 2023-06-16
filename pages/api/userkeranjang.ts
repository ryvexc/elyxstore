import { NextApiRequest, NextApiResponse } from "next";
import IDataBarang from "@/interfaces/DataBarang";
import clientPromise from "@/lib/mongodb";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<Promise<void>> {
  try {
    const client = await clientPromise;
    const db = client.db("ryve_store");

    const cartsData = await db
      .collection("carts")
      .find({ username: request.body.username })
      .toArray();

    const itemsData = await db.collection("items").find({}).toArray();

    cartsData.forEach(cartItem => {
      JSON.parse(JSON.stringify(itemsData)).forEach((item: IDataBarang) => {
        if (cartItem.nama == item.nama) {
          cartItem.stok = item.stok;
          cartItem.gambar = item.gambar;
        }
      });
    });

    response.status(200).json(cartsData);
  } catch (e) {
    console.error(e);
  }
}
