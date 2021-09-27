import * as f from "faunadb";
import { NextApiRequest, NextApiResponse } from "next";

import { client } from "lib/faunadb";
import { Query } from "types/Query";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "POST": {
      try {
        const data = await client.query<Query<any>>(
          f.Map(
            f.Paginate(f.Documents(f.Collection("urls")), { size: 100_000 }),
            f.Lambda((x) => f.Get(x)),
          ),
        );

        return res.json({
          doc: data,
          status: "success",
        });
      } catch (e) {
        if (e?.description) {
          return res.status(400).json({
            error: e.description,
            status: "error",
          });
        }

        console.log(e);
        return res.json({
          error: "An unexpected error occurred",
          status: "error",
        });
      }
    }
    default: {
      return res.status(405).json({
        error: "Method not allowed",
        status: "error",
      });
    }
  }
}
