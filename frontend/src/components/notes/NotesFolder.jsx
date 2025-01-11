import { FaFolder } from "react-icons/fa6";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Link } from "react-router-dom";
import useNoteFolders from "@/hooks/useNoteFolders";
import useAddNoteToFolder from "@/hooks/useAddNoteToFolder";
// TODO: implement loading and error states

const NotesFolder = ({ filter }) => {
  const { folders, isLoading, isError } = useNoteFolders();
  const { addNoteToFolder } = useAddNoteToFolder();

  const handleDrop = (e, folder) => {
    e.preventDefault();
    const noteId = e.dataTransfer.getData("noteId");

    addNoteToFolder({
      folderId: folder._id,
      name: folder.name,
      type: folder.type,
      noteId,
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const FolderBlock = ({ folder }) => {
    const formattedDate = new Date(folder.createdAt).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

    return (
      <>
        <Link to={`/folder/${folder._id}`}>
          <li onDrop={(e) => handleDrop(e, folder)} onDragOver={handleDragOver}>
            <div className="text-black bg-white rounded-xl p-4 min-w-[100px]">
              <FaFolder className="size-10"></FaFolder>
              <h1 className="font-bold text-xl truncate pt-1 pb-1">
                {folder.name}
              </h1>
              <p className="text-xs">{formattedDate}</p>
            </div>
          </li>
        </Link>
      </>
    );
  };

  return (
    <>
      <h1 className="text-2xl font-bold py-4">Folders</h1>
      <ScrollArea
        className={filter === "Folder" ? "flex-grow h-full" : "flex-grow h-fit"}
      >
        {folders && (
          <ul className="grid gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {folders.map((folder) => (
              <FolderBlock key={folder.id} folder={folder}></FolderBlock>
            ))}
          </ul>
        )}
      </ScrollArea>
    </>
  );
};

export default NotesFolder;
