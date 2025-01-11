import React, { useReducer, useState } from "react";
import { Button } from "./ui/button";

function FilterBar({ filter, onFilterChange }) {
  const clickHandler = (e) => {
    onFilterChange(e.target.innerText);
  };

  return (
    <div className="flex flex-shrink-0 gap-4">
      <Button
        className={`rounded-2xl px-6 ${
          filter === "All"
            ? "bg-white text-black hover:bg-white hover:text-black"
            : "bg-white/20 hover:bg-white hover:text-black"
        }`}
        onClick={clickHandler}
      >
        All
      </Button>
      <Button
        className={`rounded-2xl px-6 ${
          filter === "Folder"
            ? "bg-white text-black hover:bg-white hover:text-black"
            : "bg-white/20 hover:bg-white hover:text-black"
        }`}
        onClick={clickHandler}
      >
        Folder
      </Button>
      <Button
        className={`rounded-2xl px-6 ${
          filter === "Document"
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
