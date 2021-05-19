import { Collection, Create } from "faunadb";
import { NextApiRequest, NextApiResponse } from "next";
import isUrl from "is-absolute-url";
import slugify from "slugify";
import * as yup from "yup";
import { Url } from "types/Url";
import { client } from "@lib/faunadb";

const schema = yup.object().shape({
  slug: yup.string().trim().required().lowercase().max(255),
  url: yup.string().trim().required().url().max(2500),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "POST": {
      try {
        const { slug, url } = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

        const isValid = await schema.isValid({
          slug,
          url,
        });

        if (!isValid) {
          const error = await schema.validate({ slug, url }).catch((e) => e);

          return res.status(400).json({
            error: error.errors[0],
            status: "error",
          });
        }

        if (!isUrl(url)) {
          return res.status(400).json({
            error: "URL must be a valid (absolute) URL",
            status: "error",
          });
        }

        if (url.includes(process.env.NEXT_PUBLIC_PROD_URL)) {
          return res.status(400).json({
            error: "Cannot use this URL!",
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
          slug: encodeURIComponent(slugified),
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
