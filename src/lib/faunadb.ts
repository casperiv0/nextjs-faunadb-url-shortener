import { Client } from "faunadb";

if (!process.env.FAUNA_KEY) {
  throw new Error("`FAUNA_KEY` must be provided in the `.env` file");
}

export const client = new Client({ secret: process.env.FAUNA_KEY });
