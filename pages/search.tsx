import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import {
  Provider,
  TorrentData,
  Filter,
  FilterType,
  FilterMode,
} from "../@types";
import Download from "../components/DownloadDialog";
import { convertToBytes, nextFilterState } from "../utils";
import useSearch from "../hooks/useSearch";
import { Table, Loader } from "@mantine/core";
import { ArrowNarrowDownIcon, ArrowNarrowUpIcon } from "@heroicons/react/solid";

const Search: NextPage = () => {
  const router = useRouter();

  const query = router.query.query as string;
  const site = router.query.site as Provider;

  const [filterType, setFilterType] = useState<FilterType>(null);
  const [filterMode, setFilterMode] = useState<FilterMode>(null);

  const { isLoading, isError, data } = useSearch(
    query,
    site,
    filterType,
    filterMode
  );

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

  const filterHandler = (type: FilterType) => {
    setFilterType(type);
    setFilterMode(nextFilterState(filterMode));
  };

  const filterStateHandler = (type: FilterType): FilterMode => {
    if (type === filterType) {
      return filterMode;
    } else return null;
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
          <Table highlightOnHover>
            <thead>
              <tr>
                <th>Name</th>

                <FilterHeaders
                  label="Size"
                  filterState={filterStateHandler("size")}
                  clickHandler={() => filterHandler("size")}
                />

                <FilterHeaders
                  label="Seeds"
                  filterState={filterStateHandler("seeders")}
                  clickHandler={() => filterHandler("seeders")}
                />
                <FilterHeaders
                  label="Leeches"
                  filterState={filterStateHandler("leechers")}
                  clickHandler={() => filterHandler("leechers")}
                />

                <FilterHeaders
                  label="Added"
                  filterState={filterStateHandler("time")}
                  clickHandler={() => filterHandler("time")}
                />

                <th>Uploader</th>
              </tr>
            </thead>
            <tbody>
              {torrents.map((torrent, index) => {
                return (
                  <tr key={torrent.name + index}>
                    <td
                      style={{ maxWidth: "40rem" }}
                      className="cursor-pointer"
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
  filterState: FilterMode;
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
      ) : filterState === "desc" ? (
        <ArrowNarrowDownIcon className="h-4 w-4 text-primary" />
      ) : null}
    </th>
  );
};
