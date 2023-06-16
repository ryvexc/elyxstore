import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const db = client.db("ryve_store");

    await db.collection("history").updateOne(
      {
        $and: [
          {
            username: request.body.username,
            _id: new ObjectId(request.body.invoice),
          },
        ],
      },
      { $set: { status: request.body.status } }
    );

    response.redirect("/admin");
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: "Internal Server Error" });
  }
}
