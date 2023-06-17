import { NextApiHandler, NextApiResponse } from "next";

module.exports = (req: NextApiHandler, res: NextApiResponse) => {
  res.status(200).send("hi! this is arif");
};
