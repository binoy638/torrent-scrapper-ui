import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Provider, TorrentData, SortType, SortMode } from "../@types";
import Download from "../components/DownloadDialog";
import { nextSortState } from "../utils";
import useSearch from "../hooks/useSearch";
import { Table, Pagination } from "@mantine/core";
import { ArrowNarrowDownIcon, ArrowNarrowUpIcon } from "@heroicons/react/solid";
import NotFound from "../components/NotFound";
import { TableBody } from "../components/DisplayRows";
import { SearchPageLayout } from "../components/SearchPageLayout";
import BarsSvg from "../components/BarsSvg";

const Search: NextPage = () => {
  const router = useRouter();

  const query = router.query.query as string;
  const site = router.query.site as Provider;
  const page = router.query.page as string;

  const [pageNo, setPageNo] = useState(1);

  const [sortType, setSortType] = useState<SortType>(null);
  const [sortMode, setSortMode] = useState<SortMode>(null);

  const { isLoading, isError, data } = useSearch(
    query,
    site,
    pageNo,
    sortType,
    sortMode
  );

  useEffect(() => {
    if (router.isReady) {
      setPageNo(Number(page));
    }
  }, [page, router.isReady]);

  const [dopen, setOpen] = useState(false);

  const [dialogData, setDialogData] = useState<TorrentData>();

  const sortHandler = (type: SortType) => {
    setSortType(type);
    setSortMode(nextSortState(sortMode));
  };

  const sortStateHandler = (type: SortType): SortMode => {
    if (type === sortType) {
      return sortMode;
    } else return null;
  };

  const handlePagination = (page: number) => {
    router.push({
      pathname: "/search",
      query: { query, site, page },
    });
  };

  if (isError)
    return (
      <SearchPageLayout>
        <NotFound title="Something went wrong" />
      </SearchPageLayout>
    );

  if (isLoading || !data)
    return (
      <SearchPageLayout>
        <div className="flex justify-center items-center h-96">
          <BarsSvg />
        </div>
      </SearchPageLayout>
    );

  if (data.torrents.length === 0) {
    return (
      <SearchPageLayout>
        <div className="flex justify-center items-center h-96">
          <NotFound title="No results found" />
        </div>
      </SearchPageLayout>
    );
  }

  return (
    <SearchPageLayout>
      <div className="overflow-hidden overflow-x-scroll scrollbar-hide lg:overflow-x-hidden">
        <Table highlightOnHover striped>
          <thead>
            <tr>
              <th>Name</th>

              <SortHeaders
                label="Size"
                sortState={sortStateHandler("size")}
                clickHandler={() => sortHandler("size")}
              />

              <SortHeaders
                label="Seeds"
                sortState={sortStateHandler("seeders")}
                clickHandler={() => sortHandler("seeders")}
              />
              <SortHeaders
                label="Leeches"
                sortState={sortStateHandler("leechers")}
                clickHandler={() => sortHandler("leechers")}
              />

              <SortHeaders
                label="Added"
                sortState={sortStateHandler("time")}
                clickHandler={() => sortHandler("time")}
              />

              <th>Uploader</th>
            </tr>
          </thead>

          <TableBody
            torrents={data.torrents}
            setDialogData={setDialogData}
            setOpen={setOpen}
          />
        </Table>
        {dialogData && (
          <Download open={dopen} setOpen={setOpen} data={dialogData} />
        )}
      </div>

      <div className="flex items-center justify-center">
        <Pagination
          page={pageNo}
          onChange={handlePagination}
          total={data.totalPages}
        />
      </div>
    </SearchPageLayout>
  );
};

export default Search;

interface SortHeadersProps {
  label: string;
  sortState: SortMode;
  clickHandler: () => void;
}

const SortHeaders = ({ label, sortState, clickHandler }: SortHeadersProps) => {
  return (
    <th
      className={`cursor-pointer   ${sortState && "flex"} items-center`}
      onClick={clickHandler}
    >
      {label}
      {sortState === "asc" ? (
        <ArrowNarrowUpIcon className="h-4 w-4 text-primary" />
      ) : sortState === "desc" ? (
        <ArrowNarrowDownIcon className="h-4 w-4 text-primary" />
      ) : null}
    </th>
  );
};
