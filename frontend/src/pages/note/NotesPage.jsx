import FilterBar from "@/components/FilterBar";
import NotesDocument from "@/components/notes/NotesDocument";
import NotesFolder from "@/components/notes/NotesFolder";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { File, Folder, Plus } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const NotesPage = () => {
  const [filter, setFilter] = useState("All");

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <>
      <FilterBar filter={filter} onFilterChange={handleFilterChange} />

      <div className="flex flex-col h-full">
        {/* <NotesDocument filter={filter} /> */}
        {filter === "All" || filter === "Folder" ? (
          <NotesFolder filter={filter} />
        ) : null}
        {filter === "All" || filter === "Document" ? (
          <NotesDocument filter={filter} />
        ) : null}
      </div>
      <div className="fixed bottom-14 right-14">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <Plus
              className="bg-white rounded-full p-3 shadow-lg shadow-black/25"
              color="black"
              size={60}
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-5">
            <Link to="/create-note">
              <DropdownMenuItem className="hover:bg-zinc-200 text-lg cursor-pointer">
                <File />
                Note
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem className="hover:bg-zinc-200 text-lg cursor-pointer">
              <Folder />
              Folder
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export default NotesPage;
