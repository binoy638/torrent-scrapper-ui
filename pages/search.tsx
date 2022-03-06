import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import { Provider, TorrentData, Filter } from "../@types";
import Download from "../components/DownloadDialog";
import { convertToBytes, nextFilterState } from "../utils";
import useSearch from "../hooks/useSearch";
import { Table, Loader } from "@mantine/core";

const Search: NextPage = () => {
  const [filter, setFilter] = useState<Filter>({
    size: null,
    seeds: "dsc",
    leeches: null,
    added: null,
  });
  const router = useRouter();

  const query = router.query.query as string;
  const site = router.query.site as Provider;

  const { isLoading, isError, data } = useSearch(query, site);

  const [torrents, setTorrents] = useState<TorrentData[]>([]);

  useEffect(() => {
    if (data) {
      setTorrents(data);
    }
  }, [data]);

  const [dopen, setOpen] = useState(false);

  const [dialogData, setDialogData] = useState<TorrentData>();

  const torrentSeleteHandler = (data: TorrentData) => {
    setDialogData(data);
    setOpen(true);
  };

  const filterHandler = (col: "seeds" | "leeches" | "size" | "added") => {
    const currentFilter = filter[col];

    const nextFilter = nextFilterState(currentFilter);

    if (col === "size") {
      const newData = [...torrents].sort(
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
      setTorrents(newData);
      return;
    }
    const newData = [...torrents].sort(
      (arrayItemA: TorrentData, arrayItemB: TorrentData) => {
        if (nextFilter === "asc") return +arrayItemA[col] - +arrayItemB[col];
        else return +arrayItemB[col] - +arrayItemA[col];
      }
    );

    setFilter((previous) => ({ ...previous, [col]: nextFilter }));
    setTorrents(newData);
  };

  return (
    <div className="flex flex-col gap-8 ">
      <h1 className="text-4xl lg:text-5xl font-bold gap-2 justify-center flex">
        <Link href={"/"} passHref>
          <a>
            Torrent <span className="text-primary">Ocean</span>
          </a>
        </Link>
      </h1>

      <div className="center" style={{ flexDirection: "column", gap: "1rem" }}>
        <SearchBar />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center w-full h-56">
          <Loader className="h-6 w-6 lg:h-10 lg:w-10" color="gray" />
        </div>
      ) : isError ? (
        <div>Something went wrong</div>
      ) : (
        <div className="overflow-hidden overflow-x-scroll scrollbar-hide lg:overflow-x-hidden">
          <Table>
            <thead>
              <tr>
                <th
                  className="cursor-pointer"
                  onClick={() => filterHandler("size")}
                >
                  Name
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => filterHandler("size")}
                >
                  Size
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => filterHandler("seeds")}
                >
                  Seeds
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => filterHandler("leeches")}
                >
                  leeches
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => filterHandler("added")}
                >
                  Added
                </th>
                <th>Uploader</th>
              </tr>
            </thead>
            <tbody>
              {torrents.map((torrent, index) => {
                return (
                  <tr key={torrent.name + index}>
                    <td
                      className="cursor-pointer hover:underline"
                      onClick={() => torrentSeleteHandler(torrent)}
                    >
                      {torrent.name}
                    </td>
                    <td>{torrent.size}</td>
                    <td>{torrent.seeds}</td>
                    <td>{torrent.leeches}</td>
                    <td>{new Date(torrent.added * 1000).toDateString()}</td>
                    <td>{torrent.uploader}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          {dialogData && (
            <Download open={dopen} setOpen={setOpen} data={dialogData} />
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
