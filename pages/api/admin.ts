import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const database = client.db("ryve_store");

    const jualCollection = database.collection("history");
    const barangCollection = database.collection("items");

    const jualDocuments = await jualCollection
      .find({ status: { $in: ["PRS", "KFM", "SLS"] } })
      .sort({ tanggal: 1 })
      .toArray();

    const dataReturn = [];

    for (const jualDocument of jualDocuments) {
      const barangCodes = JSON.parse(jualDocument.detailTransaksi).barang.map(
        (data: any) => new ObjectId(data.kodebrg)
      );

      const barangDocuments = await barangCollection
        .find({ _id: { $in: barangCodes } })
        .toArray();

      dataReturn.push({
        ...jualDocument,
        dataBarang: barangDocuments,
      });
    }

    response.status(200).json(dataReturn);
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: "Internal Server Error" });
  }
}
