import useNotesWithFolder from "@/hooks/useNotesWithFolder";
import { ScrollArea } from "../ui/scroll-area";
import { Link } from "react-router-dom";
import React from "react";

const NotesInFolder = ({ folderId }) => {
  const { notes, isLoading, isError } = useNotesWithFolder(folderId);

  console.log("Notes:", notes);

  const NoteBlock = ({ note }) => {
    console.log("NOTE", note);
    const formattedDate = new Date(note.createdAt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const formattedContent =
      note.content && note.content.replace(/<[^>]*>?/gm, "");

    return (
      <Link to={`/notes/${note._id}`}>
        <li>
          <div className="text-black bg-white rounded-xl p-4 h-52">
            <p className="text-xs">{formattedDate}</p>
            <h1 className="font-bold text-xl truncate pt-1 pb-3">
              {note.title ? note.title : formattedContent}
            </h1>
            <hr className="border-black/40" />
            <p className="pt-3 text-md overflow-hidden text-ellipsis line-clamp-4">
              {formattedContent}
            </p>
          </div>
        </li>
      </Link>
    );
  };

  return (
    <ScrollArea className="flex-grow h-full">
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading notes</p>}
      {notes && notes.length > 0 ? (
        <ul className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {notes.map((note) => (
            <NoteBlock key={note._id} note={note} />
          ))}
        </ul>
      ) : (
        !isLoading && <p>No notes found</p>
      )}
    </ScrollArea>
  );
};

export default NotesInFolder;
