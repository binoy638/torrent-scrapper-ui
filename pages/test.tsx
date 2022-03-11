import { Chip, Chips } from "@mantine/core";
import React, { useState } from "react";

function Test() {
  const [provider, setProvider] = useState<string | string[]>("1337x");
  return (
    <div className="">
      <Chips value={provider} onChange={setProvider}>
        <Chip value="1337x">1337x</Chip>
        {/* <Chip value="rarbg">Rarbg</Chip> */}
        <Chip value="tpb">The Pirate Bay</Chip>
        <Chip value="nyaa">Nyaa</Chip>
      </Chips>
    </div>
  );
}

export default Test;
