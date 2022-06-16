import { useQuery } from "react-query";
import { FilterMode, FilterType, Provider } from "../@types";

import { searchTorrentAPI } from "../API";

function useSearch(
  query: string,
  provider: Provider,
  page: number,
  filterType: FilterType,
  filterMode: FilterMode
) {
  return useQuery(
    ["search", query, page, provider, filterType, filterMode],
    () => {
      if (!query || !provider) return;
      if (filterMode && !filterType) return;
      if (filterType && !filterMode) return;
      return searchTorrentAPI(query, provider, page, filterType, filterMode);
    },
    {
      enabled: !!query,
    }
  );
}

export default useSearch;
