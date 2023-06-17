import { NextApiRequest, NextApiResponse } from "next";
import { AES } from "crypto-ts";
import clientPromise from "@/lib/mongodb";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<any> {
  try {
    const client = await clientPromise;
    const db = client.db("ryve_store");

    const result = await db.collection("users").insertOne({
      nama: request.body.namalengkap,
      username: request.body.username,
      password: AES.encrypt(
        request.body.password,
        process.env.KEY as string
      ).toString(),
      lastsearch: "",
      isAdmin: 0,
    });

    if (!result.acknowledged) {
      response.writeHead(302, { location: "/result?success=false" });
      throw result;
    }
    response.writeHead(302, { location: "/result?success=true" });
  } catch (e) {
    console.error(e);
  }
}
