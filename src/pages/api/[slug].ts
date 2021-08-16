import * as f from "faunadb";
import { NextApiRequest, NextApiResponse } from "next";
import { Url } from "types/Url";
import { client } from "lib/faunadb";
import { Query } from "types/Query";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;

  switch (method) {
    case "GET": {
      try {
        const slug = query.slug;
        const doc = await client.query<Query<Url>>(f.Get(f.Match(f.Index("urls_by_slug"), slug)));

        const updated = await client.query<Query<Url>>(
          f.Update(doc.ref, {
            data: {
              url: doc.data.url,
              slug: doc.data.slug,
              clicks: (doc.data.clicks ?? 0) + 1,
            },
          }),
        );

        return res.json({
          doc: updated.data,
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
