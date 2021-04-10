import { Collection, Create } from "faunadb";
import { NextApiRequest, NextApiResponse } from "next";
import isUrl from "is-absolute-url";
import slugify from "slugify";
import { Url } from "../../interfaces/Url";
import { client } from "../../lib/faunadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "POST": {
      try {
        const { slug, url } = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

        if (!isUrl(url)) {
          return res.status(400).json({
            error: "URL must be a valid (absolute) URL",
            status: "error",
          });
        }

        const slugified = slugify(slug, {
          replacement: "-",
          lower: true,
          remove: /[*./]/,
        });

        const data: Url = {
          url,
          slug: slugified,
          clicks: 0,
        };

        const doc = await client.query<{ data: Url }>(
          Create(Collection("urls"), {
            data,
          })
        );

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
        } else {
          console.log(e);
          return res.json({
            error: "An unexpected error occurred",
            status: "error",
          });
        }
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
