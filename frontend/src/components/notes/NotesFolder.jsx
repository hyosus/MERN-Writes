import axiosInstance from "@/lib/axios";
import { FaFolder } from "react-icons/fa6";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Link } from "react-router-dom";
import useNoteFolders from "@/hooks/useNoteFolders";
// TODO: implement loading and error states

const NotesFolder = ({ filter }) => {
  const { folders, isLoading, isError } = useNoteFolders();

  const FolderBlock = ({ name, date }) => {
    const formattedDate = new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    return (
      <>
        <Link to="/folder/:id">
          <li>
            <div className="text-black bg-white rounded-xl p-4 min-w-[100px]">
              <FaFolder className="size-10"></FaFolder>
              <h1 className="font-bold text-xl truncate pt-1 pb-1">{name}</h1>
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
      <ScrollArea className={filter === "Folder" ? "h-[85%]" : "h-fit"}>
        {folders && (
          <ul className="grid gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {folders.map((folder) => (
              <FolderBlock
                key={folder.id}
                name={folder.name}
                date={folder.createdAt}
              ></FolderBlock>
            ))}
          </ul>
        )}
      </ScrollArea>
    </>
  );
};

export default NotesFolder;
