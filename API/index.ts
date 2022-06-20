import { FilterMode, FilterType, Provider, TorrentData } from "../@types";
import { API } from "./config";

export const searchTorrentAPI = async (
  query: string,
  provider: Provider,
  page: number,
  filterType: FilterType = null,
  filterMode: FilterMode = null
): Promise<{ torrents: TorrentData[]; totalPages: number }> => {
  try {
    if (!query || !provider || !page)
      throw new Error("Invalid query or provider");

    const isNSFW = query.split(" ")[0] === "!x";

    if (isNSFW) query = query.split(" ").slice(1).join(" ").trim();

    let url = `search/${provider}?q=${query}&page=${page}&nsfw=${isNSFW}`;

    if (filterMode && filterType)
      url += `&filtertype=${filterType}&filtermode=${filterMode}`;

    if (filterType === "time") url += "&cache=false";

    const { data } = await API.get<{
      torrents: TorrentData[];
      totalPages: number;
    }>(url);

    const torrents = data.torrents.map((item: TorrentData) => ({
      ...item,
      provider,
    }));

    return { torrents, totalPages: data.totalPages };
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
