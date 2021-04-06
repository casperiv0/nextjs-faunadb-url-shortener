import Head from "next/head";
import * as React from "react";

export default function Home() {
  const [url, setUrl] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    setError(null);

    if (!slug || !url) {
      return setError("URL and slug are required!");
    }

    try {
      const res = await fetch("/api/new", {
        method: "POST",
        body: JSON.stringify({
          url,
          slug,
        }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(`${process.env.NEXT_PUBLIC_PROD_URL}/${data.doc.slug}`);
      }
    } catch (e) {
      console.log(e);
      setError("An unexpected error occurred");
    }
  }

  return (
    <div className="bg-gray-50 h-screen flex items-center">
      <Head>
        <title>FaunaDB URL shortener</title>
      </Head>

      <div className="w-3/5 md:mx-auto">
        <h1 className="text-2xl mb-5">Create a shortened URL!</h1>

        <form onSubmit={handleSubmit}>
          {error ? (
            <div className="bg-red-500 p-3 rounded-md text-white mb-3 transition-all">
              <p>{error}</p>
            </div>
          ) : null}
          <div className="flex flex-col mb-3">
            <label className="mb-3" htmlFor="url">
              Enter URL
            </label>
            <input
              type="url"
              id="url"
              className="p-2 px-3 rounded-md ring-2 ring-gray-200 outline-none focus:ring-2 focus:ring-gray-600 transition-all"
              placeholder="URL"
              value={url}
              onChange={(e) => setUrl(e.currentTarget.value)}
            />
          </div>

          <div className="flex flex-col mb-3">
            <label className="mb-3" htmlFor="slug">
              Enter Slug
            </label>
            <input
              type="text"
              id="slug"
              className="p-2 px-3 rounded-md ring-2 ring-gray-200 outline-none focus:ring-2 focus:ring-gray-600 transition-all"
              placeholder="Slug"
              value={slug}
              onChange={(e) => setSlug(e.currentTarget.value)}
            />
          </div>

          <div className="flex justify-between">
            <div>Shortened URL: {result}</div>

            <div>
              <button className="p-2 px-4 text-white rounded-md bg-gray-600 self-end transition-all">
                Create!
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
