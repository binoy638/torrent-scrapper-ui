import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { ChangeEvent, useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import Loader from "react-loader-spinner";
import axios from "axios";
import { Provider } from ".";
import Download from "../components/Download";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

export interface TorrentData {
  name: string;
  leeches: number;
  seeds: number;
  size: string;
  uploader: string;
  link: string;
  provider: Provider;
}

const Search: NextPage = () => {
  const [error, setError] = useState<null | string>(null);
  const [dopen, setOpen] = useState(false);
  const [dialogData, setDialogData] = useState<TorrentData | null>(null);
  const router = useRouter();
  const [provider, setProvider] = useState<Provider>(
    router.query.site as Provider
  );
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<TorrentData[]>([]);

  useEffect(() => {
    if (!router.isReady) return;

    setLoading(true);
    setProvider(router.query.site as Provider);
    setQuery(router.query.query as string);
    fetchData(router.query.query as string, router.query.site as Provider);
  }, [router, router.isReady]);

  const fetchData = async (searchQuery: string, provider: Provider) => {
    try {
      const { data } = await axios.get(
        `https://vercel-torrent-scrapper.vercel.app/api/${provider}/search?q=${searchQuery}`
      );
      if (data?.result) {
        const newData = data.result.map((r: object) => ({
          ...r,
          provider,
        }));
        setResult(newData);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filterBySeedersHandler = () => {
    // console.log("inside");
    const newData = [...result].sort(
      (arrayItemA: TorrentData, arrayItemB: TorrentData) => {
        if (arrayItemA.seeds < arrayItemB.seeds) {
          return -1;
        }

        if (arrayItemA.seeds > arrayItemB.seeds) {
          return 1;
        }

        return 0;
      }
    );
    console.log(newData);
    setResult(newData);
  };

  const submitHandler = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push({ pathname: "/search", query: { query, site: provider } });
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={() => setError(null)}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div className="search-result-container">
      <div className="center" style={{ flexDirection: "column", gap: "1rem" }}>
        <SearchBar
          query={query}
          setQuery={setQuery}
          submitHandler={submitHandler}
          provider={provider}
          setProvider={setProvider}
          clas="search-page-input"
        />
      </div>

      {loading ? (
        <div className="loading-container center">
          Searching...
          <Loader type="TailSpin" color="#94b4da" height={50} width={50} />
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th className="priority-1">Name</th>
                <th className="priority-2">Size</th>
                <th className="priority-2" onClick={filterBySeedersHandler}>
                  Seeders
                </th>
                <th className="priority-2">Leechers</th>
                <th className="priority-2">Uploader</th>
              </tr>
            </thead>

            <tbody>
              {result.map((r) => {
                return (
                  <tr
                    key={r.name}
                    onClick={() => {
                      setOpen(true);
                      setDialogData(r);
                    }}
                  >
                    <td className="name priority-1">{r.name}</td>
                    <td className="priority-2">{r.size}</td>
                    <td className="seeder priority-2">{r.seeds}</td>
                    <td className="leecher priority-2">{r.leeches}</td>
                    <td className="uploader priority-2">{r.uploader}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Download
            open={dopen}
            setOpen={setOpen}
            data={dialogData}
            setError={setError}
          />
          <Snackbar
            open={error !== null}
            autoHideDuration={6000}
            onClose={() => setError(null)}
            message={error ? error : ""}
            action={action}
          />
        </div>
      )}
    </div>
  );
};

export default Search;
