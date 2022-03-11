import type { NextPage } from "next";
import SearchBar from "../components/SearchBar";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full ">
      <div className="w-full lg:w-3/4 flex flex-col gap-6">
        <div className="w-full flex justify-center items-center flex-col gap-4">
          <h1 className="text-4xl lg:text-5xl font-bold">
            <Link href={"/"} passHref>
              <a>
                Torrent <span className="text-primary">Ocean</span>
              </a>
            </Link>
          </h1>

          <p>
            Safest place to download torrents. <span>NO VPN NEEDED!</span>
          </p>
        </div>
        <SearchBar />
      </div>
    </div>
  );
};

export default Home;
