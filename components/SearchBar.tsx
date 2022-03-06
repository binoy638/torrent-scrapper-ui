import { Chip, Chips, Input, Tooltip, Button } from "@mantine/core";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ChangeEvent } from "react";
import { ImSearch } from "react-icons/im";

function SearchBar() {
  const router = useRouter();

  const site = router.query.site as string;

  const query = router.query.query as string;

  const [provider, setProvider] = useState<string | string[]>("1337x");

  useEffect(() => {
    if (
      site === "1337x" ||
      site === "tpb" ||
      site === "rarbg" ||
      site === "nyaa"
    ) {
      setProvider(site);
    }
  }, [site]);

  const submitHandler = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    router.push({
      pathname: "/search",
      query: { query: event.target.query.value, site: provider },
    });
  };
  const rightSection = (
    <Button
      sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
      type="submit"
    >
      <ImSearch />
    </Button>
  );
  return (
    <form onSubmit={submitHandler} className="flex flex-col gap-6  ">
      <Input
        name="query"
        value={query}
        placeholder="Search..."
        rightSection={rightSection}
      />
      <div className="flex justify-center">
        <Chips value={provider} onChange={setProvider}>
          <Chip value="1337x">1337x</Chip>
          {/* <Chip value="rarbg">Rarbg</Chip> */}
          <Chip value="tpb">The Pirate Bay</Chip>
          <Chip value="nyaa">Nyaa</Chip>
        </Chips>
      </div>
    </form>
  );
}

export default SearchBar;
