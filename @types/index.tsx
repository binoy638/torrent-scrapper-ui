export type Provider = "rarbg" | "tpb" | "1337x" | "nyaa";

export interface TorrentData {
  name: string;
  leeches: number;
  seeds: number;
  size: string;
  uploader?: string;
  link: string;
  file?: string;
  provider: Provider;
  added: number;
}

export type SortState = null | "asc" | "desc";

export type SortType = "seeders" | "leechers" | "size" | "time" | null;

export type SortMode = "asc" | "desc" | null;
