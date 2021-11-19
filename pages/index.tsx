import type { NextPage } from "next";
import { ChangeEvent, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import SearchBar from "../components/SearchBar";

export type Provider = "rarbg" | "piratebay" | "threesven" | "nyaa";

const Home: NextPage = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [provider, setProvider] = useState<Provider>("threesven");

  const submitHandler = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push({ pathname: "/search", query: { query, site: provider } });
  };

  return (
    <div>
      <Head>
        <title>Torrent Ocean</title>
        <meta name="description" content="torrent search engine" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="main-container center">
        <div className="wrapper center">
          <div className="heading center">
            <h1>
              Torrent <span>Ocean</span>
            </h1>
            <p>
              Safest place to download torrents. <span>NO VPN NEEDED!</span>
            </p>
          </div>
          <SearchBar
            query={query}
            setQuery={setQuery}
            submitHandler={submitHandler}
            provider={provider}
            setProvider={setProvider}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
