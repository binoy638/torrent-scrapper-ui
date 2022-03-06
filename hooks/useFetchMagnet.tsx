import { useQuery } from "react-query";
import { Provider } from "../@types";

import { fetchTorrentMagnet } from "../API";

function useFetchMagnet(provider: Provider, link: string) {
  return useQuery(
    ["magnet", provider, link],
    () => {
      if (provider === "nyaa") {
        if (link) return link;
      } else {
        return fetchTorrentMagnet(provider, link);
      }
    },
    {
      enabled: !!link,
    }
  );
}

export default useFetchMagnet;
