import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import useJournalFolders from "@/hooks/useJournalFolders";
import { LoaderCircle } from "lucide-react";

function JournalSideBar() {
  const { folders, isLoading, isError } = useJournalFolders();

  if (isError) {
    console.error("Error fetching folders:", isError);
  }

  useEffect(() => {
    console.log("Folders data:", folders);
  }, [folders]);

  const FolderBlock = ({ folder }) => {
    return (
      <Link to={`/journal/folder/${folder._id}`} key={folder._id}>
        <Button
          variant="ghost"
          className="w-full h-12 hover:bg-zinc-800 flex items-center justify-start gap-4 text-left hover:text-white"
        >
          <div
            className="size-[12px] rounded-[3px]"
            style={{ backgroundColor: folder.colour }} // Fix backgroundColor style
          />
          {folder.name}
        </Button>
      </Link>
    );
  };
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
      {isLoading && <LoaderCircle size={50} className="animate-spin" />}
      {isError && <p className="text-red-600">Failed to fetch folders</p>}
      {folders &&
        folders.map((folder) => (
          <FolderBlock key={folder._id} folder={folder} />
        ))}
    </>
  );
}

export default JournalSideBar;
