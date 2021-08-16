import Head from "next/head";
import * as React from "react";
import { getThemeFromLocal, Theme, updateBodyClass, updateLocalTheme } from "lib/theme";
import { MoonIcon } from "icons/MoonIcon";
import { SunIcon } from "icons/Sun";

export default function Home() {
  const [url, setUrl] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const [theme, setTheme] = React.useState<Theme>("dark");

  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    ref.current?.focus();
  }, []);

  React.useEffect(() => {
    const t = getThemeFromLocal();

    setTheme(t);
    updateBodyClass(t);
  }, []);

  function handleThemeChange() {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    updateLocalTheme(newTheme);
  }

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
    <div className="bg-gray-50 dark:bg-gray-800 text-black dark:text-gray-300 h-screen flex items-center justify-center w-screen">
      <Head>
        <title>FaunaDB URL shortener</title>

        <meta name="twitter:title" content="FaunaDB URL shortener" />
        <meta property="og:site_name" content="FaunaDB URL shortener" />
        <meta property="og:title" content="FaunaDB URL shortener" />

        <meta
          name="description"
          content="A simple FaunaDB, tailwindcss and next.js URL shortener"
        />
        <meta
          property="og:description"
          content="A simple FaunaDB, tailwindcss and next.js URL shortener"
        />
        <meta
          name="twitter:description"
          content="A simple FaunaDB, tailwindcss and next.js URL shortener"
        />

        <link rel="canonical" href="https://ctgs.ga" />
        <meta property="og:url" content="https://ctgs.ga" />
      </Head>

      <div className="absolute top-5 left-5">
        <a
          rel="noopener noreferrer"
          target="_blank"
          href="https://github.com/Dev-CasperTheGhost/nextjs-faunadb-url-shortener"
          className="py-2 px-3 bg-gray-600 dark:bg-gray-700 text-white rounded-md"
        >
          Source code
        </a>
      </div>

      <div className="absolute top-5 right-5">
        <button onClick={handleThemeChange} className="p-2">
          {theme === "dark" ? (
            <MoonIcon className="fill-current text-white" width="20px" height="20px" />
          ) : (
            <SunIcon className="fill-current text-gray-700" width="20px" height="20px" />
          )}
        </button>
      </div>

      <div className="w-screen px-10 md:w-9/12 xl:w-3/6 xl:px-0">
        <h1 className="text-2xl mb-5">Create a shortened URL!</h1>

        <form onSubmit={handleSubmit}>
          <div
            className={`bg-red-500 p-3 rounded-md text-white mb-3 transition-all ${
              error ? "opacity-1" : "opacity-0"
            }`}
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
              className="p-2 px-3 bg-white dark:bg-gray-700 rounded-md ring-2 ring-gray-200 dark:ring-gray-600 outline-none focus:ring-2 focus:ring-gray-600 dark:focus:ring-white transition-all"
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
              className="p-2 px-3 bg-white dark:bg-gray-700 rounded-md ring-2 ring-gray-200 dark:ring-gray-600 outline-none focus:ring-2 focus:ring-gray-600 dark:focus:ring-white transition-all"
              placeholder="Slug"
              value={slug}
              onChange={(e) => setSlug(e.currentTarget.value)}
            />
          </div>

          <div className="flex justify-between">
            <div>
              Shortened URL:{" "}
              {result ? (
                <>
                  <a
                    className="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={result}
                  >
                    {result}
                  </a>
                  <span
                    className="text-sm ml-2 text-white dark:text-gray-300 bg-gray-600 dark:bg-gray-700 p-0.5 px-1 rounded cursor-pointer"
                    onClick={(e) => {
                      const element = e.currentTarget;

                      navigator.clipboard.writeText(result);
                      element.innerText = "Copied!";

                      setTimeout(() => {
                        element.innerText = "Copy";
                      }, 600);
                    }}
                  >
                    Copy
                  </span>
                </>
              ) : null}
            </div>

            <div>
              <button
                disabled={loading}
                className={`p-2 px-4 text-white rounded-md bg-gray-600 dark:bg-gray-700 self-end transition-all ${
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
