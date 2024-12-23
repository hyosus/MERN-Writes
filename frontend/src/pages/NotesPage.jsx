import FilterBar from "@/components/FilterBar";
import NotesDocument from "@/components/NotesDocument";
import NotesFolder from "@/components/NotesFolder";
import React from "react";

function NotesPage() {
  return (
    <div className="text-white bg-zinc-900 w-full h-[calc(100vh-40px-3rem)] rounded-lg p-6">
      <FilterBar></FilterBar>
      <NotesFolder></NotesFolder>
      <NotesDocument></NotesDocument>
    </div>
  );
}

export default NotesPage;
