import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { ChangeEvent, useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import Loader from "react-loader-spinner";
import axios from "axios";
import { Provider, TorrentData, FilterState, Filter } from "../@types";
import Download from "../components/Download";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { ImFloppyDisk, ImHappy, ImSad, ImUpload3 } from "react-icons/im";
import { convertToBytes, nextFilterState } from "../utils";

const Search: NextPage = () => {
  const [filter, setFilter] = useState<Filter>({
    size: null,
    seeds: null,
    leeches: null,
    added: null,
  });

  const [error, setError] = useState<null | string>(null);

  const [loading, setLoading] = useState(true);

  const [result, setResult] = useState<TorrentData[]>([]);

  const [dopen, setOpen] = useState(false);

  const [dialogData, setDialogData] = useState<TorrentData | null>(null);

  const router = useRouter();

  const [provider, setProvider] = useState<Provider>(
    router.query.site as Provider
  );

  const [query, setQuery] = useState("");

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
        `https://torrent-scrapper.backendev.com/search/${provider}?q=${searchQuery}`
      );
      if (data?.results) {
        const newData = data.results.map((r: object) => ({
          ...r,
          provider,
        }));
        setResult(newData);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const filterHandler = (col: "seeds" | "leeches" | "size" | "added") => {
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
                <th
                  className="priority-2"
                  onClick={() => filterHandler("added")}
                  style={{ cursor: "pointer" }}
                >
                  Date
                </th>
                <th className="priority-2">Uploader</th>
              </tr>
            </thead>

            <tbody>
              {result &&
                result.map((r) => {
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
                      <td className="priority-2">
                        {new Date(r.added * 1000).toDateString()}
                      </td>
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
