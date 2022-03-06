import { Provider, TorrentData } from "../@types";
import { API } from "./config";

export const searchTorrentAPI = async (
  query: string,
  provider: Provider
): Promise<TorrentData[]> => {
  try {
    const { data } = await API.get(`search/${provider}?q=${query}`);

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
