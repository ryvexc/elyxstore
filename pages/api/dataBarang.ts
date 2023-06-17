import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

module.exports = handler;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const db = client.db("ryve_store");

    console.log(req.query);

    let items;

    if (req.query.kodebrg)
      items = await db
        .collection("items")
        .find({
          nama: { $regex: req.query.barang, $options: "i" },
          _id: new ObjectId(req.query.kodebrg as string),
        })
        .sort({ nama: 1 })
        .toArray();
    else if (req.query.toko)
      items = await db
        .collection("items")
        .find({
          nama: { $regex: req.query.barang, $options: "i" },
          toko: req.query.toko,
        })
        .sort({ nama: 1 })
        .toArray();
    else if (req.query.kodebrg)
      items = await db
        .collection("items")
        .find({
          nama: { $regex: req.query.barang, $options: "i" },
          _id: new ObjectId(req.query.kodebrg as string),
        })
        .sort({ nama: 1 })
        .toArray();
    else
      items = await db
        .collection("items")
        .find({ nama: { $regex: req.query.barang, $options: "i" } })
        .sort({ nama: 1 })
        .toArray();

    res.status(200).json(items);
  } catch (e) {
    console.error(e);
  }
}
