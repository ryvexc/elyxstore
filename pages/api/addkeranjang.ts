import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  const subtotal: any = eval(
    `${request.body.jumlahbarang} * ${request.body.hargabarang}`
  );

  try {
    const client = await clientPromise;
    const db = client.db("ryve_store");

    const cartItems = await db
      .collection("carts")
      .find({
        $and: [
          { kodebrg: request.body.kodebarang, username: request.body.username },
        ],
      })
      .toArray();

    if (cartItems.length > 0) {
      const duplicatedDataSubtotal =
        eval(subtotal) + parseInt(cartItems[0].subtotal);

      const updateDataResult = await db.collection("carts").updateOne(
        {
          $and: [
            { kodebrg: request.body.kodebarang },
            { username: request.body.username },
          ],
        },
        {
          $set: {
            jumlah:
              parseInt(cartItems[0].jumlah) +
              parseInt(request.body.jumlahbarang),
            subtotal: parseInt(duplicatedDataSubtotal),
          },
        }
      );

      if (updateDataResult.modifiedCount > 0) {
        response.writeHead(302, { location: "/history" });
      }
    } else {
      const insertResult = await db.collection("carts").insertOne({
        username: request.body.username,
        kodebrg: request.body.kodebarang,
        nama: request.body.namabarang,
        harga: parseInt(request.body.hargabarang),
        jumlah: parseInt(request.body.jumlahbarang),
        subtotal: parseInt(subtotal),
      });

      response.writeHead(302, { location: "/history" });
    }

    response.json({});
  } catch (e) {
    console.error(e);
  }
}
