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

export type FilterState = null | "asc" | "dsc";

export interface Filter {
  size: FilterState;
  seeds: FilterState;
  leeches: FilterState;
  added: FilterState;
}
