import React from "react";
import { ChangeEvent, useState } from "react";
import { ImSearch } from "react-icons/im";
import { Provider } from "../pages/index";

interface SearchBarProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  submitHandler: (event: ChangeEvent<HTMLFormElement>) => void;
  provider: Provider;
  setProvider: React.Dispatch<React.SetStateAction<Provider>>;
  width?: string;
}

function SearchBar({
  query,
  setQuery,
  submitHandler,
  width,
  provider,
  setProvider,
}: SearchBarProps) {
  return (
    <form
      onSubmit={submitHandler}
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <div className=" search-bar center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="search center"
          style={{ width: width }}
        />
        <button type="submit" className="center">
          <ImSearch />
        </button>
      </div>
      <div className="checkbox center">
        <label>
          <input
            type="checkbox"
            checked={provider === "rarbg"}
            onChange={() => setProvider("rarbg")}
          />
          RARBG
        </label>
        <label>
          <input
            type="checkbox"
            checked={provider === "piratebay"}
            onChange={() => setProvider("piratebay")}
          />
          The Pirate Bay
        </label>
        <label>
          <input
            type="checkbox"
            checked={provider === "threesven"}
            onChange={() => setProvider("threesven")}
          />
          1337x
        </label>
      </div>
    </form>
  );
}

export default SearchBar;
