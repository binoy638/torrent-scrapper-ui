import * as React from "react";
import { TorrentData } from "../@types";
import useFetchMagnet from "../hooks/useFetchMagnet";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  DocumentDownloadIcon,
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
  CalendarIcon,
  DownloadIcon,
  ClipboardIcon,
} from "@heroicons/react/solid";
import { Drawer, Loader, Text, Tooltip } from "@mantine/core";
import { useEffect, useState } from "react";

export interface DownloadDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: TorrentData;
}

export default function DownloadDialog({
  open,
  setOpen,
  data,
}: DownloadDialogProps) {
  const handleClose = () => {
    setOpen(false);
  };
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (copied === true) {
      timer = setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [copied]);

  const {
    data: Magnet,
    isError,
    isLoading,
  } = useFetchMagnet(data.provider, data.link);

  const downloadMagnetHandler = (mag: string) => {
    window.location.href = mag;
  };

  return (
    <Drawer opened={open} onClose={handleClose} position="bottom" size="40vh">
      <div className="px-4 flex h-full flex-col  gap-8  lg:py-4 items-center lg:text-2xl ">
        <div className="flex  flex-col gap-6  ">
          <Text lineClamp={2}>
            <span className="text-lg  lg:text-3xl overflow-hidden">
              {data.name}
            </span>
          </Text>

          <div className="flex gap-4 lg:gap-6  justify-evenly lg:justify-center ">
            <div className="flex flex-col lg:flex-row gap-1  items-center w-1/4  lg:w-auto">
              <DocumentDownloadIcon className="h-6 w-6 text-primary" />
              <span>{data.size}</span>
            </div>
            <div className="flex gap-1 flex-col lg:flex-row  items-center sm:w-1/4 lg:w-auto">
              <ChevronDoubleDownIcon className="h-6 w-6 text-green-500" />
              <span>{data.seeds}</span>
            </div>
            <div className="flex gap-1 flex-col lg:flex-row  items-center sm:w-1/4 lg:w-auto">
              <ChevronDoubleUpIcon className="h-6 w-6 text-red-500" />
              <span>{data.leeches}</span>
            </div>
            <div className="flex gap-1 flex-col lg:flex-row  items-center sm:w-1/4 lg:w-auto">
              <CalendarIcon className="h-6 w-6 text-primary" />
              <span className="font-sm">
                {new Date(data.added * 1000).toLocaleString([], {
                  dateStyle: "short",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          {isLoading ? (
            <Loader className="h-6 w-6 lg:h-10 lg:w-10" color="gray" />
          ) : isError ? (
            <span className="text-sm text-red-500">Error</span>
          ) : (
            Magnet && (
              <>
                <DownloadIcon
                  onClick={() => downloadMagnetHandler(Magnet)}
                  className="h-6 w-6 lg:h-10 lg:w-10 cursor-pointer"
                />
                <CopyToClipboard text={Magnet} onCopy={() => setCopied(true)}>
                  <Tooltip
                    label="link copied"
                    withArrow
                    opened={copied}
                    delay={500}
                  >
                    <ClipboardIcon className="h-6 w-6 lg:h-10 lg:w-10 cursor-pointer" />
                  </Tooltip>
                </CopyToClipboard>
              </>
            )
          )}
        </div>
      </div>
    </Drawer>
  );
}
