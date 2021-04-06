import { GetServerSideProps } from "next";
import * as React from "react";
import Head from "next/head";
import Link from "next/link";

interface Props {
  data: string;
}

const Slug = ({ data }: Props) => {
  return (
    <div className="bg-gray-50 h-screen flex flex-col justify-center items-center">
      <Head>
        <title>404 - Not found</title>
      </Head>

      <p className="text-4xl">{data}</p>
      <Link href="/">
        <a className="mt-8 p-2 px-4 bg-gray-600 text-white rounded-md">Return to home</a>
      </Link>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_PROD_URL}/api/${ctx.query.slug}`).then((r) =>
    r.json()
  );

  // url was found
  if (res.status === "success") {
    ctx.res.setHeader("location", res.doc.url);
    ctx.res.statusCode = 301;
    ctx.res.end();
  }

  return {
    props: {
      data: res?.status === "error" ? res.error : res,
    },
  };
};

export default Slug;
