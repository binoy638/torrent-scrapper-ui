import React from "react";
import { ChangeEvent } from "react";
import { ImSearch } from "react-icons/im";
import { Provider } from "../@types";

interface SearchBarProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  submitHandler: (event: ChangeEvent<HTMLFormElement>) => void;
  provider: Provider;
  setProvider: React.Dispatch<React.SetStateAction<Provider>>;
  clas?: string;
}

function SearchBar({
  query,
  setQuery,
  submitHandler,
  clas,
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
          className={clas ? `${clas} search center` : "search center"}
        />
        <button type="submit" className="center">
          <ImSearch color="#a3a3a3" />
        </button>
      </div>
      <div className="checkbox center">
        <label>
          <input
            type="checkbox"
            checked={provider === "1337x"}
            onChange={() => setProvider("1337x")}
          />
          1337x
        </label>
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
            checked={provider === "tpb"}
            onChange={() => setProvider("tpb")}
          />
          The Pirate Bay
        </label>

        <label>
          <input
            type="checkbox"
            checked={provider === "nyaa"}
            onChange={() => setProvider("nyaa")}
          />
          Nyaa
        </label>
      </div>
    </form>
  );
}

export default SearchBar;
