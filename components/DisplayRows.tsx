import React, { FC } from "react";
import { TorrentData } from "../@types";

interface TableBodyProps {
  torrents: TorrentData[];
  setDialogData: React.Dispatch<React.SetStateAction<TorrentData | undefined>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TableBody: FC<TableBodyProps> = ({
  torrents,

  setDialogData,
  setOpen,
}) => {
  const torrentSeleteHandler = (data: TorrentData) => {
    setDialogData(data);
    setOpen(true);
  };

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
