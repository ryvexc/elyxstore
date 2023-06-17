import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<any> {
  const client = await clientPromise;
  // console.log(request.body);
  await client
    .db("ryve_store")
    .collection("carts")
    .updateOne(
      { _id: new ObjectId(request.body.id) },
      {
        $set: { jumlah: request.body.jumlah, subtotal: request.body.subtotal },
      }
    );

  response.end();
}
