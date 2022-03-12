import { FilterMode, FilterType, Provider, TorrentData } from "../@types";
import { API } from "./config";

export const searchTorrentAPI = async (
  query: string,
  provider: Provider,
  filterType: FilterType = null,
  filterMode: FilterMode = null
): Promise<TorrentData[]> => {
  try {
    if (!query || !provider) throw new Error("Invalid query or provider");

    let url = `search/${provider}?q=${query}`;

    if (filterMode && filterType)
      url += `&filtertype=${filterType}&filtermode=${filterMode}`;

    if (filterType === "time") url += "&cache=false";

    const { data } = await API.get(url);

    return data.results.map((item: TorrentData) => ({
      ...item,
      provider,
    }));
  } catch (error) {
    console.log(error);
    throw new Error("Error while searching torrents");
  }
};

export const fetchTorrentMagnet = async (provider: Provider, link: string) => {
  try {
    const { data } = await API.get(`get/${provider}?link=${link}`);
    const magnet = data.data?.magnet;
    if (!magnet.startsWith("magnet:?xt=urn:btih:"))
      throw new Error("Invalid magnet");
    return magnet;
  } catch (error) {
    console.log(error);
    throw new Error("Error while fetching magnet link");
  }
};
