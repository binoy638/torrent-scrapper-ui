import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import { Provider, TorrentData, FilterType, FilterMode } from "../@types";
import Download from "../components/DownloadDialog";
import { nextFilterState } from "../utils";
import useSearch from "../hooks/useSearch";
import { Table, Pagination, Loader } from "@mantine/core";
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

  const [filterType, setFilterType] = useState<FilterType>(null);
  const [filterMode, setFilterMode] = useState<FilterMode>(null);

  const { isLoading, isError, data } = useSearch(
    query,
    site,
    pageNo,
    filterType,
    filterMode
  );

  useEffect(() => {
    if (router.isReady) {
      setPageNo(Number(page));
    }
  }, [page, router.isReady]);

  const [dopen, setOpen] = useState(false);

  const [dialogData, setDialogData] = useState<TorrentData>();

  const filterHandler = (type: FilterType) => {
    setFilterType(type);
    setFilterMode(nextFilterState(filterMode));
  };

  const filterStateHandler = (type: FilterType): FilterMode => {
    if (type === filterType) {
      return filterMode;
    } else return null;
  };

  const handlePagination = (page: number) => {
    router.push({
      pathname: "/search",
      query: { query, site, page },
    });
  };

  if (isLoading || !data)
    return (
      <SearchPageLayout>
        <div className="flex justify-center items-center h-96">
          <BarsSvg />
        </div>
      </SearchPageLayout>
    );

  if (isError)
    return (
      <SearchPageLayout>
        <NotFound title="Something went wrong" />
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
