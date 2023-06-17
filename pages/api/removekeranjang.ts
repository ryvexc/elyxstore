import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<any> {
  const client = await clientPromise;
  const db = client.db("ryve_store");

  const deleteResult = await db.collection("carts").deleteOne({
    $and: [
      { username: request.body.username },
      { _id: new ObjectId(request.body.id) },
    ],
  });

  if (deleteResult.deletedCount == 0) throw "Error While Deleting Cart Item";
  response.status(200).json(JSON.parse(JSON.stringify(deleteResult)));
}
