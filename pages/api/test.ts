import { NextApiHandler, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

module.exports = async (req: NextApiHandler, res: NextApiResponse) => {
  try {
    const client = await clientPromise;
    const db = client.db("ryve_store");

    res.status(200).json(await db.collection("accounts").find({}).toArray());
  } catch (e) {
    console.log(e);
  }
};
