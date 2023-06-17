import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

// prettier-ignore
export default async function handler(request: NextApiRequest, response: NextApiResponse): Promise<any> {
  const client = await clientPromise;
  const db = client.db("ryve_store");

  await db.collection("users").updateOne({ username: request.query.username }, { lastsearch: request.query.lastsearch });

  return;
}
