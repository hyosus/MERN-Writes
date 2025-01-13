import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

function JournalSideBar() {
  return (
    <>
      <Link to="/journal">
        <Button
          variant="ghost"
          className="w-full h-12 hover:bg-zinc-800 flex items-center justify-start gap-4 text-left hover:text-white"
        >
          <div className="size-[12px] rounded-[3px] bg-white" />
          All Entries
        </Button>
      </Link>

      <hr className="h-[1px] w-full" />

      {/* TODO: get journal folders to map and display dynamic icon color */}
      <Link to="/journal">
        <Button
          variant="ghost"
          className="w-full h-12 hover:bg-zinc-800 flex items-center justify-start gap-4 text-left hover:text-white"
        >
          <div
            className="size-[12px] rounded-[3px]"
            style={{ backgroundColor: "folder.bgColor" }}
          />
          Folder 1
        </Button>
      </Link>
    </>
  );
}

export default JournalSideBar;
