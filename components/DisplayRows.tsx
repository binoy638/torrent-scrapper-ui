import { Loader, Skeleton } from "@mantine/core";
import React, { FC } from "react";
import { TorrentData } from "../@types";

interface TableBodyProps {
  torrents: TorrentData[];
  isLoading: boolean;
  setDialogData: React.Dispatch<React.SetStateAction<TorrentData | undefined>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TableBody: FC<TableBodyProps> = ({
  torrents,
  isLoading,
  setDialogData,
  setOpen,
}) => {
  const torrentSeleteHandler = (data: TorrentData) => {
    setDialogData(data);
    setOpen(true);
  };
  if (isLoading) {
    return (
      <tbody>
        {Array.from({ length: 15 }).map((_, i) => (
          <tr key={i}>
            <td className="h-10" colSpan={6}></td>
          </tr>
        ))}
      </tbody>
    );
  }
  return (
    <tbody>
      {torrents.map((torrent, index) => {
        return (
          <tr key={torrent.name + index}>
            <td
              style={{ maxWidth: "40rem" }}
              className="cursor-pointer"
              onClick={() => torrentSeleteHandler(torrent)}
            >
              {torrent.name}
            </td>
            <td>{torrent.size}</td>
            <td>{torrent.seeds}</td>
            <td>{torrent.leeches}</td>
            <td>{new Date(torrent.added * 1000).toDateString()}</td>
            <td>{torrent.uploader}</td>
          </tr>
        );
      })}
    </tbody>
  );
};
