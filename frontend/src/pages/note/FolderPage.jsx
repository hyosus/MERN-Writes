import NotesInFolder from "@/components/notes/NotesInFolder";
import useFolder from "@/hooks/useFolder";
import React from "react";
import { FaFolder } from "react-icons/fa6";
import { useParams } from "react-router-dom";

const FolderPage = () => {
  const { folderId } = useParams();
  const { folder, isLoading, isError } = useFolder(folderId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading note</div>;
  }

  return (
    <>
      <h1 className="flex gap-2 items-center pb-4">
        <FaFolder />
        {folder.name}
      </h1>
      <NotesInFolder folderId={folderId} />
    </>
  );
};

export default FolderPage;
