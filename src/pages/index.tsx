import Head from "next/head";
import * as React from "react";

export default function Home() {
  const [url, setUrl] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    ref.current.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    setError(null);

    if (!slug || !url) {
      return setError("URL and slug are required!");
    }
    setLoading(true);

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

      setLoading(false);
    } catch (e) {
      console.log(e);
      setError("An unexpected error occurred");
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-50 h-screen flex items-center justify-center w-screen">
      <Head>
        <title>FaunaDB URL shortener</title>

        <meta name="twitter:title" content="FaunaDB URL shortener" />
        <meta property="og:site_name" content="FaunaDB URL shortener" />
        <meta property="og:title" content="FaunaDB URL shortener" />

        <meta name="description" content="A simple FaunaDB, tailwindcss and next.js URL shortener" />
        <meta property="og:description" content="A simple FaunaDB, tailwindcss and next.js URL shortener" />
        <meta name="twitter:description" content="A simple FaunaDB, tailwindcss and next.js URL shortener" />

        <link rel="canonical" href="https://ctgs.ga" />
        <meta property="og:url" content="https://ctgs.ga" />
      </Head>

      <div className="absolute top-5 left-5">
        <a
          rel="noopener noreferrer"
          target="_blank"
          href="https://github.com/Dev-CasperTheGhost/nextjs-faunadb-url-shortener"
          className="py-2 px-3 bg-gray-600 text-white rounded-md"
        >
          Source code
        </a>
      </div>

      <div className="w-screen px-10 md:w-9/12 xl:w-3/6 xl:px-0">
        <h1 className="text-2xl mb-5">Create a shortened URL!</h1>

        <form onSubmit={handleSubmit}>
          <div
            className={`bg-red-500 p-3 rounded-md text-white mb-3 transition-all ${error ? "opacity-1" : "opacity-0"}`}
          >
            <p>{error}</p>
          </div>

          <div className="flex flex-col mb-3">
            <label className="mb-3" htmlFor="url">
              Enter URL
            </label>
            <input
              ref={ref}
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
            <div>
              Shortened URL:{" "}
              <a className="hover:underline" target="_blank" rel="noopener noreferrer" href={result}>
                {result}
              </a>
            </div>

            <div>
              <button
                disabled={loading}
                className={`p-2 px-4 text-white rounded-md bg-gray-600 self-end transition-all ${
                  loading ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                {loading ? "loading..." : "Create!"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
