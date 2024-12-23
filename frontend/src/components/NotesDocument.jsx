import { axiosInstance } from "@/lib/axios";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";

async function getNotes() {
  try {
    const response = await axiosInstance.get("/notes/notes-no-folder");
    return response.data;
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
}

function NoteBlock({ note }) {
  const formattedDate = new Date(note.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <li>
      <div className="text-black bg-white rounded-xl p-4 h-52">
        <p className="text-xs">{formattedDate}</p>
        <h1 className="font-bold text-xl truncate pt-1 pb-3">
          {note.title ? note.title : note.content}
        </h1>
        <hr className="border-black/40" />
        <p className="pt-3 text-md overflow-hidden text-ellipsis line-clamp-4">
          {note.content}
        </p>
      </div>
    </li>
  );
}

function NotesDocument() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const notesData = await getNotes();
      setNotes(notesData);
    };

    fetchNotes();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold pb-4">Documents</h1>

      <ScrollArea className="h-[80%]">
        <ul className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {notes.slice(0, 6).map((note) => (
            <NoteBlock key={note.id} note={note} />
          ))}
        </ul>
      </ScrollArea>
    </>
  );
}

export default NotesDocument;
