import React, { useState } from "react";

function SelectInput() {
  return (
    <div>
      <select name="provider" className="select-input">
        <option value="rarbg">RARBG</option>
        <option value="piratebay">The Pirate Bay</option>
        <option value="threesven">1337x</option>
      </select>
    </div>
  );
}

export default SelectInput;
