import { NextApiRequest, NextApiResponse } from "next";
import db from "@/database/connection";
import { QueryError } from "mysql2";
import { AES, enc } from "crypto-ts";
import { serialize } from "cookie";
import clientPromise from "@/lib/mongodb";
import { redirect } from "next/navigation";

export interface IDataUser {
  _id?: string;
  nama: string;
  username: string;
  password: string;
  lastsearch: string;
  isAdmin: number;
}

// prettier-ignore
export default async function handler(request: NextApiRequest, response: NextApiResponse): Promise<Promise<void>> {
  try {
    const client = await clientPromise;
    const db = client.db("ryve_store");

    let userdata: JSON = JSON.parse("{}");
    let dataCount: number = 0;

    const data = await db
      .collection("users")
      .find({ username: request.body.username })
      .limit(1)
      .toArray();
    
    data.forEach((user: any) => {
      if (AES.decrypt(user.password, process.env.KEY as string).toString(enc.Utf8) === request.body.password) {
        dataCount++;
        userdata = user;
      }
    });

    if (dataCount == 0) response.redirect("/login");
    response.setHeader("Set-Cookie", [
      serialize("clientLogged", "true", { path: "/" }),
      serialize("userdata", `${JSON.stringify(userdata)}`, { path: "/" }),
    ]);
    response.redirect("/home");
    redirect("/home");
  } catch (e) {
    console.error(e);
  }
}
