import { EditorContent, useEditor } from "@tiptap/react";
import { ToolBar } from "./Toolbar";
import StarterKit from "@tiptap/starter-kit";
import "./TipTap.css";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createNote, updateNote } from "@/lib/api.js";

export const NotesRTE = ({ noteId: initialNoteId, initialContent }) => {
  const [content, setContent] = useState(initialContent);
  const [noteId, setNoteId] = useState(initialNoteId); // Track the created note ID

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

  useEffect(() => {
    if (initialNoteId) {
      setNoteId(initialNoteId);
    }
    if (initialContent) {
      setContent(initialContent);
      if (editor) {
        editor.commands.setContent(initialContent);
      }
    }
  }, [initialNoteId, initialContent]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write something …",
      }),
    ],
    content: content,
    onUpdate({ editor }) {
      const updatedContent = editor.getHTML(); // get editor's content
      setContent(updatedContent);

      if (noteId) {
        editNote({ id: noteId, content: updatedContent });
      } else {
        addNote({ content: updatedContent });
      }
    },
  });

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <>
      <div className="CONTAINER flex flex-col h-full flex-grow-1">
        <ToolBar editor={editor} />
        <EditorContent editor={editor} className="flex-grow-1 h-full" />
      </div>
    </>
  );
};
