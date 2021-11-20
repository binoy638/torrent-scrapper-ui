import React from "react";
import { GetServerSideProps } from "next";
import axios from "axios";
import { TorrentData } from "../@types";
import { useRouter } from "next/router";
function Test({ torrent }: { torrent: TorrentData[] }) {
  const [value, setValue] = React.useState("");
  const router = useRouter();
  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        onClick={(e) => {
          router.push({
            pathname: "/test",
            query: { query: value },
          });
        }}
      >
        Submit
      </button>
      <button
        onClick={() =>
          torrent.sort((arrA, arrB) => +arrA["seeds"] - +arrB["seeds"])
        }
      >
        Sort
      </button>
      <div>
        {torrent.length ? (
          torrent.map((t, index) => {
            return (
              <div key={index}>
                <p>{t.name}</p>
              </div>
            );
          })
        ) : (
          <div>No results</div>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  let props;
  try {
    const { data } = await axios.get(
      `https://vercel-torrent-scrapper.vercel.app/api/rarbg/search?q=${query.query}`
    );

    const torrent = data.result;
    props = { torrent: torrent as TorrentData[] };
  } catch (error) {
    console.log(error);
    props = { torrent: [] };
  }

  return {
    props,
  };
};

export default Test;
