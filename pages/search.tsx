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
import { ArrowNarrowDownIcon, ArrowNarrowUpIcon } from "@heroicons/react/solid";

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

      setFilter(
        Object.assign(
          {},
          { size: null, seeds: null, leeches: null, added: null },
          { [col]: nextFilter }
        )
      );
      setTorrents(newData);
      return;
    }
    const newData = [...torrents].sort(
      (arrayItemA: TorrentData, arrayItemB: TorrentData) => {
        if (nextFilter === "asc") return +arrayItemA[col] - +arrayItemB[col];
        else return +arrayItemB[col] - +arrayItemA[col];
      }
    );

    setFilter(
      Object.assign(
        {},
        { size: null, seeds: null, leeches: null, added: null },
        { [col]: nextFilter }
      )
    );
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
                <th>Name</th>

                <FilterHeaders
                  label="Size"
                  filterState={filter.size}
                  clickHandler={() => filterHandler("size")}
                />

                <FilterHeaders
                  label="Seeds"
                  filterState={filter.seeds}
                  clickHandler={() => filterHandler("seeds")}
                />
                <FilterHeaders
                  label="Leeches"
                  filterState={filter.leeches}
                  clickHandler={() => filterHandler("leeches")}
                />

                <FilterHeaders
                  label="Added"
                  filterState={filter.added}
                  clickHandler={() => filterHandler("added")}
                />

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

interface FilterHeadersProps {
  label: string;
  filterState: "asc" | "dsc" | null;
  clickHandler: () => void;
}

const FilterHeaders = ({
  label,
  filterState,
  clickHandler,
}: FilterHeadersProps) => {
  return (
    <th
      className={`cursor-pointer   ${filterState && "flex"} items-center`}
      onClick={clickHandler}
    >
      {label}
      {filterState === "asc" ? (
        <ArrowNarrowUpIcon className="h-4 w-4 text-primary" />
      ) : filterState === "dsc" ? (
        <ArrowNarrowDownIcon className="h-4 w-4 text-primary" />
      ) : null}
    </th>
  );
};

export async function getStaticProps() {
  return {
    props: {}, // will be passed to the page component as props
  };
}
