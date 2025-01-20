import { NotesRTE } from "@/components/tiptap/NotesRTE";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createNote, updateNote } from "@/lib/api.js";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export default () => {
  const [title, setTitle] = useState("");
  const [noteId, setNoteId] = useState(null); // Track the created note ID

  const { mutate: addNote } = useMutation({
    mutationFn: createNote,
    onSuccess: (data) => {
      console.log("Note created with ID: ", data._id);
      setNoteId(data._id); // Set the created note ID
    },
  });

  const { mutate: editNote } = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      console.log("Note updated");
    },
  });

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    if (noteId) {
      editNote({ id: noteId, title: newTitle });
    } else {
      addNote({ title: newTitle });
    }
  };

  return (
    <>
      <div className="flex-shrink-1 pb-5">
        <Label>Title</Label>
        <Input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="border-white/30"
        />
      </div>
      <NotesRTE noteId={noteId} />
    </>
  );
};
