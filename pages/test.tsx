import React, { useState } from "react";
import { Button, Drawer, Text, Input, Table } from "@mantine/core";
import SearchBar from "../components/SearchBar";
import { ImFloppyDisk, ImUpload3 } from "react-icons/im";
import {
  CalendarIcon,
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClipboardIcon,
  CloudUploadIcon,
  DocumentDownloadIcon,
  DownloadIcon,
  UploadIcon,
} from "@heroicons/react/solid";

const Item = ({ header, value }: { header: string; value: string }) => {
  return (
    <div className="flex gap-2">
      <span className="font-bold">{header} :</span>
      <span>{value}</span>
    </div>
  );
};

function Test() {
  const [opened, setOpened] = useState(false);
  return (
    <div className="">
      <Button onClick={() => setOpened(true)}>Open Drawer</Button>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        position="bottom"
        size="40vh"
      >
        <div className="px-4 flex h-full flex-col gap-8  lg:py-4 items-center lg:text-2xl ">
          <div className="flex flex-col gap-6 justify-center items-center ">
            <div className="text-xl lg:text-3xl overflow-hidden">
              <Text lineClamp={2}>
                Avengers Lorem ipsum dolor sit, amet consectetur adipisicing
                elit.
              </Text>
            </div>

            <div className="flex gap-6">
              <div className="flex gap-1 justify-start items-center">
                <DocumentDownloadIcon className="h-6 w-6 text-primary" />
                <span>2 GB</span>
              </div>
              <div className="flex gap-1 justify-start items-center">
                <ChevronDoubleDownIcon className="h-6 w-6 text-green-500" />
                <span>344</span>
              </div>
              <div className="flex gap-1 justify-start items-center">
                <ChevronDoubleUpIcon className="h-6 w-6 text-red-500" />
                <span>344</span>
              </div>
              <div className="flex gap-1 justify-start items-center">
                <CalendarIcon className="h-6 w-6 text-primary" />
                <span>344</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <DownloadIcon className="h-6 w-6 lg:h-10 lg:w-10 cursor-pointer" />
            <ClipboardIcon className="h-6 w-6 lg:h-10 lg:w-10 cursor-pointer" />
          </div>
        </div>
      </Drawer>
    </div>
  );
}

export default Test;
