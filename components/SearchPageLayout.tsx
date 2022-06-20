import Link from "next/link";
import React, { FC } from "react";
import SearchBar from "./SearchBar";

interface SearchPageLayoutProps {
  children: React.ReactNode;
}

export const SearchPageLayout: FC<SearchPageLayoutProps> = ({ children }) => {
  return (
    <main className="flex flex-col gap-8 pb-10 ">
      <h1 className="text-4xl lg:text-5xl font-bold gap-2 justify-center flex">
        <Link href={"/"} passHref>
          <a>
            Torrent <span className="text-primary">Ocean</span>
          </a>
        </Link>
      </h1>
      <div className="center" style={{ flexDirection: "column", gap: "1rem" }}>
        <SearchBar />
      </div>
      {children}
    </main>
  );
};
