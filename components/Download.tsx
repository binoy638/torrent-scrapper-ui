import * as React from "react";
import Dialog from "@mui/material/Dialog";
import Loader from "react-loader-spinner";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { TorrentData } from "../@types";
import DialogTitle from "@mui/material/DialogTitle";
import { VscMagnet } from "react-icons/vsc";
import {
  ImFloppyDisk,
  ImHappy,
  ImSad,
  ImUpload3,
  ImDownload3,
} from "react-icons/im";
import axios from "axios";

export interface DownloadDialogProps {
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
  console.log(data);
  const magnetHandler = async () => {
    if (data?.provider === "nyaa") {
      if (data?.link) return (window.location.href = data.link);
    }
    if (!data?.provider || !data?.link) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `https://torrent-scrapper.backendev.com/get/${data.provider}?link=${data.link}`
      );

      if (response.data) {
        if (response.data.data?.magnet) {
          window.location.href = response.data.data.magnet;
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
        <DialogTitle className="title" id="alert-dialog-title">
          {data && data.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div className="info center">
              <div>
                <ImFloppyDisk color="rgb(95, 132, 241)" />{" "}
                <span>{data && data.size}</span>
              </div>
              <div>
                <ImHappy color="rgb(40, 241, 40)" />{" "}
                <span>{data && data.seeds}</span>
              </div>
              <div>
                <ImSad color="rgb(247, 23, 23)" />{" "}
                <span>{data && data.leeches}</span>
              </div>
              <div>
                <ImUpload3 color="rgb(190, 28, 223)" />
                <span>{data && data.uploader}</span>
              </div>
            </div>
          </DialogContentText>
          <div className="action center">
            <div onClick={magnetHandler}>
              <VscMagnet className="action-icon" />
              <div> Magnet</div>
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
