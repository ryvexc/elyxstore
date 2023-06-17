import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<any> {
  const POST = request.body;

  const client = await clientPromise;
  const db = client.db("ryve_store");

  const items = await db.collection("barang").find({}).toArray();
  const cartData = await db
    .collection("carts")
    .find({ username: request.body.username })
    .toArray();

  console.log(cartData);

  cartData.forEach((cart: any) => {
    items.forEach(async (item: any) => {
      if (item._id == cart._id) {
        const updateResult = await db.collection("item").updateOne(
          { kodebrg: cart._id as string },
          {
            $set: {
              stok: item.stok - cart.jumlah,
            },
          }
        );

        if (updateResult.modifiedCount == 0)
          throw "Error while updating new stok for items.";
      }
    });
  });

  let totalHarga = 0;
  let dataKeranjang = await db
    .collection("carts")
    .find({ username: request.body.username })
    .toArray();

  dataKeranjang.forEach(data => {
    totalHarga += data.subtotal;
  });

  console.log(totalHarga);

  const insertHistoryResult = await db.collection("history").insertOne({
    tanggal: new ObjectId().getTimestamp(),
    total: totalHarga,
    username: request.body.username,
    detailTransaksi: request.body.detailTransaksi,
    status: "KFM",
  });

  const deleteResult = await db
    .collection("carts")
    .deleteMany({ username: request.body.username });

  if (insertHistoryResult.insertedId && deleteResult.deletedCount > 0)
    response.writeHead(302, { location: "/history" });
  else response.writeHead(302, { location: request.headers.referer! });
}
