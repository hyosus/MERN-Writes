import FilterBar from "@/components/FilterBar";
import NotesDocument from "@/components/notes/NotesDocument";
import NotesFolder from "@/components/notes/NotesFolder";
import React, { useState } from "react";

function NotesPage() {
  const [filter, setFilter] = useState("All");

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <div className="text-white bg-zinc-900 w-full h-[calc(100vh-40px-3rem)] rounded-lg p-6">
      <FilterBar filter={filter} onFilterChange={handleFilterChange} />

      <div className="flex flex-col h-full">
        {filter === "All" || filter === "Folder" ? (
          <NotesFolder filter={filter} />
        ) : null}
        {filter === "All" || filter === "Document" ? (
          <NotesDocument filter={filter} />
        ) : null}
      </div>
    </div>
  );
}

export default NotesPage;
