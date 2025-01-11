import { RichTextEditor } from "@/components/tiptap/RichTextEditor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useNote from "@/hooks/useNote";
import { updateNote } from "@/lib/api.js";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default () => {
  const { noteId } = useParams();
  const { note, isLoading, isError } = useNote(noteId);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  console.log(content);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  const { mutate: editNote } = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      console.log("Note updated");
    },
  });

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    editNote({ id: noteId, title: newTitle, content });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading note</div>;
  }

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
      <RichTextEditor noteId={noteId} initialContent={content} />
    </>
  );
};
