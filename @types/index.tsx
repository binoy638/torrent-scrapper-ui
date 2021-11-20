export type Provider = "rarbg" | "piratebay" | "1337" | "nyaa";

export interface TorrentData {
  name: string;
  leeches: number;
  seeds: number;
  size: string;
  uploader?: string;
  link: string;
  file?: string;
  provider: Provider;
}

export type FilterState = null | "asc" | "dsc";

export interface Filter {
  size: FilterState;
  seeds: FilterState;
  leeches: FilterState;
}
