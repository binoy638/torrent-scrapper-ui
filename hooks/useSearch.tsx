import { useQuery } from "react-query";
import { Provider } from "../@types";

import { searchTorrentAPI } from "../API";

function useSearch(query: string, provider: Provider) {
  return useQuery(
    ["search", query, provider],
    () => searchTorrentAPI(query, provider),
    {
      enabled: !!query,
    }
  );
}

export default useSearch;
