import { Get, Index, Match } from "faunadb";
import { NextApiRequest, NextApiResponse } from "next";
import { Url } from "../../interfaces/Url";
import { client } from "../../lib/faunadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;

  switch (method) {
    case "GET": {
      try {
        const slug = query.slug;
        const doc = await client.query<{ data: Url }>(Get(Match(Index("urls_by_slug"), slug)));

        return res.json({
          doc: doc.data,
          status: "success",
        });
      } catch (e) {
        if (e?.description) {
          return res.status(400).json({
            error: e.description,
            status: "error",
          });
        }
      }
      break;
    }
    default: {
      return res.status(405).json({
        error: "Method not allowed",
        status: "error",
      });
    }
  }
}
