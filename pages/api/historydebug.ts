import db from "@/database/connection";
import { QueryError } from "mysql2";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  db.connect((err: QueryError | null) => {
    if (err) throw err;
    db.query(
      "SELECT tanggal FROM jual WHERE username LIKE 'arif'",
      (err, res) => {
        if (err) throw err;
        response.status(200).json(res);
      }
    );
  });
}
