import { SortState } from "../@types";

export const convertToBytes = (str: string) => {
  const times: { [char: string]: number } = {
    kb: 1,
    mb: 2,
    gb: 3,
    tb: 4,
  };
  const byteSequence = str.trim().slice(-2).toLowerCase();
  const num = str
    .trim()
    .slice(0, str.trim().length - 2)
    .trim();
  return +num * Math.pow(1024, times[byteSequence]);
};

export const nextSortState = (current: SortState) => {
  if (current === null) return "desc";
  if (current === "desc") return "asc";
  else return "desc";
};
