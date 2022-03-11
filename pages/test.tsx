import React from "react";

function Test() {
  return (
    <div className="">
      <button
        type="button"
        onClick={() => {
          throw new Error("Sentry Frontend yo Error");
        }}
      >
        Throw error
      </button>
    </div>
  );
}

export default Test;
