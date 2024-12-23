import React, { useReducer, useState } from "react";
import { Button } from "./ui/button";

function FilterBar() {
  const [state, setState] = useState("All");

  const clickHandler = (e) => {
    setState(e.target.innerText);
  };

  return (
    <div className="flex gap-4">
      <Button
        className={`rounded-2xl px-6 ${
          state === "All"
            ? "bg-white text-black hover:bg-white hover:text-black"
            : "bg-white/20 hover:bg-white hover:text-black"
        }`}
        onClick={clickHandler}
      >
        All
      </Button>
      <Button
        className={`rounded-2xl px-6 ${
          state === "Folder"
            ? "bg-white text-black hover:bg-white hover:text-black"
            : "bg-white/20 hover:bg-white hover:text-black"
        }`}
        onClick={clickHandler}
      >
        Folder
      </Button>
      <Button
        className={`rounded-2xl px-6 ${
          state === "Document"
            ? "bg-white text-black hover:bg-white hover:text-black"
            : "bg-white/20 hover:bg-white hover:text-black"
        }`}
        onClick={clickHandler}
      >
        Document
      </Button>
    </div>
  );
}

export default FilterBar;
