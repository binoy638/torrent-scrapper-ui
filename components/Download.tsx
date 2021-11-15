import * as React from "react";
import Dialog from "@mui/material/Dialog";
import Loader from "react-loader-spinner";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

import DialogTitle from "@mui/material/DialogTitle";
import { TorrentData } from "../pages/search";
import { VscMagnet } from "react-icons/vsc";
import {
  ImFloppyDisk,
  ImHappy,
  ImSad,
  ImUpload3,
  ImDownload3,
} from "react-icons/im";
import axios from "axios";

interface DownloadDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: TorrentData | null;
  setError: React.Dispatch<React.SetStateAction<null | string>>;
}

export default function DownloadDialog({
  open,
  setOpen,
  data,
  setError,
}: DownloadDialogProps) {
  const [loading, setLoading] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const downloadHandler = async () => {
    if (!data?.provider || !data?.link) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `https://vercel-torrent-scrapper.vercel.app/api/${data.provider}/get?link=${data.link}`
      );
      if (response?.data?.result) {
        if (response.data.result?.torrent_file) {
          window.location.href = response.data.result.torrent_file;
        } else {
          setError("Could not download file.");
        }
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      setError("Something went wrong.");
      setLoading(false);
      console.log(error);
    }
  };

  const magnetHandler = async () => {
    if (!data?.provider || !data?.link) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `https://vercel-torrent-scrapper.vercel.app/api/${data.provider}/get?link=${data.link}`
      );
      if (response?.data?.result) {
        if (response.data.result?.magnet) {
          window.location.href = response.data.result.magnet;
        } else {
          setError("Magnet not found.");
        }
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      setError("Something went wrong.");
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <div className="download-dialog-container">
        <DialogTitle id="alert-dialog-title">{data && data.name}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div className="info center">
              <div>
                <ImFloppyDisk color="royalblue" />{" "}
                <span>{data && data.size}</span>
              </div>
              <div>
                <ImHappy color="green" /> <span>{data && data.seeds}</span>
              </div>
              <div>
                <ImSad color="red" /> <span>{data && data.leeches}</span>
              </div>
              <div>
                <ImUpload3 color="purple" />
                <span>{data && data.uploader}</span>
              </div>
            </div>
          </DialogContentText>
          <div className="action center">
            <div onClick={magnetHandler}>
              <VscMagnet size="50" />
              <div> Magnet</div>
            </div>
            <div onClick={downloadHandler}>
              <ImDownload3 size="50" />
              <div>Download</div>
            </div>
          </div>
          <div className="center">
            {loading && (
              <Loader type="ThreeDots" color="#94b4da" height={50} width={50} />
            )}
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}
