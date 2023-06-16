import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb", // Set desired value here
    },
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = await clientPromise;
    const db = client.db("ryve_store");

    db.collection("items").insertOne({
      nama: req.body.nama,
      harga: req.body.harga,
      stok: req.body.stok,
      gambar: req.body.dataGambar,
      rate: 0,
      deskripsi: req.body.deskripsi,
      toko: req.body.toko,
    });

    res.redirect("/profile");
  } catch (e) {
    console.error(e);
  }
};
