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
import {
  ImFloppyDisk,
  ImHappy,
  ImSad,
  ImUpload3,
  ImDownload3,
} from "react-icons/im";
import { Preview } from "@mui/icons-material";

const convertToBytes = (str: string) => {
  const times: { [char: string]: number } = {
    kb: 1,
    mb: 2,
    gb: 3,
    tb: 4,
  };
  const byteSequence = str.trim().slice(-2).toLowerCase();
  const num = str
    .trim()
    .slice(0, str.trim().length - 2)
    .trim();
  return +num * Math.pow(1024, times[byteSequence]);
};

export interface TorrentData {
  name: string;
  leeches: number;
  seeds: number;
  size: string;
  uploader: string;
  link: string;
  provider: Provider;
}

type FilterState = null | "asc" | "dsc";

interface Filter {
  size: FilterState;
  seeds: FilterState;
  leeches: FilterState;
}

const nextFilterState = (current: FilterState) => {
  if (current === null) return "dsc";
  if (current === "dsc") return "asc";
  else return "dsc";
};

const Search: NextPage = () => {
  const [filter, setFilter] = useState<Filter>({
    size: null,
    seeds: null,
    leeches: null,
  });

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

  const filterHandler = (col: "seeds" | "leeches" | "size") => {
    const currentFilter = filter[col];

    const nextFilter = nextFilterState(currentFilter);

    if (col === "size") {
      const newData = [...result].sort(
        (arrayItemA: TorrentData, arrayItemB: TorrentData) => {
          if (nextFilter === "asc")
            return (
              +convertToBytes(arrayItemA[col]) -
              +convertToBytes(arrayItemB[col])
            );
          else
            return (
              +convertToBytes(arrayItemB[col]) -
              +convertToBytes(arrayItemA[col])
            );
        }
      );
      setFilter((previous) => ({ ...previous, [col]: nextFilter }));
      setResult(newData);
      return;
    }
    const newData = [...result].sort(
      (arrayItemA: TorrentData, arrayItemB: TorrentData) => {
        if (nextFilter === "asc") return +arrayItemA[col] - +arrayItemB[col];
        else return +arrayItemB[col] - +arrayItemA[col];
      }
    );

    setFilter((previous) => ({ ...previous, [col]: nextFilter }));
    setResult(newData);
  };

  useEffect(() => {
    console.log(filter);
  }, [filter]);

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
                <th className="priority-1">Torrent</th>
                <th
                  className="priority-2"
                  onClick={() => filterHandler("size")}
                  style={{ cursor: "pointer" }}
                >
                  Size
                </th>
                <th
                  className="priority-2"
                  onClick={() => filterHandler("seeds")}
                  style={{ cursor: "pointer" }}
                >
                  Seeders
                </th>
                <th
                  className="priority-2"
                  onClick={() => filterHandler("leeches")}
                  style={{ cursor: "pointer" }}
                >
                  Leechers
                </th>
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
                    <td className="name priority-1">
                      <div>{r.name}</div>
                      <div className="additional-info">
                        <div>
                          <ImFloppyDisk color="rgb(95, 132, 241)" />{" "}
                          <span>{r.size}</span>
                        </div>
                        <div>
                          <ImHappy color="rgb(40, 241, 40)" />{" "}
                          <span>{r.seeds}</span>
                        </div>
                        <div>
                          <ImSad color="rgb(247, 23, 23)" />{" "}
                          <span>{r.leeches}</span>
                        </div>
                        <div>
                          <ImUpload3 color="rgb(190, 28, 223)" />
                          <span>{r.uploader}</span>
                        </div>
                      </div>
                    </td>
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
// if (arrayItemA.seeds < arrayItemB.seeds) {
//   return -1;
// }

// if (arrayItemA.seeds > arrayItemB.seeds) {
//   return 1;
// }

// return 0;
