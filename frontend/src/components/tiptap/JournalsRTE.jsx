import React, { useEffect, useState } from "react";
import { ToolBar } from "./Toolbar";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import { useMutation } from "@tanstack/react-query";
import { createEntry, updateEntry } from "@/lib/api.js";

const JournalsRTE = ({ date, initialId }) => {
  console.log("1. ID: ", initialId);
  const [content, setContent] = useState("");
  const [entryId, setEntryId] = useState(initialId); // Track the created entry ID

  useEffect(() => {
    setEntryId(initialId);
  }, [initialId]);

  console.log("2. entryId: ", entryId);

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

      if (entryId) {
        // edit
        editEntry({ entryId, data: { content: updatedContent, date: date } });
      } else {
        // create
        addEntry({ content: updatedContent, date: date });
      }
    },
  });

  const { mutate: addEntry } = useMutation({
    mutationFn: createEntry,
    onSuccess: (data) => {
      setEntryId(data._id); // Set the created entry ID
      console.log("Entry created with ID: ", data._id);
    },
  });

  const { mutate: editEntry } = useMutation({
    mutationFn: updateEntry,
    onSuccess: (data) => {
      console.log("Entry updated: ", data);
    },
    onError: (error) => {
      console.error("Error updating entry: ", error);
    },
  });

  return (
    <div className="CONTAINER flex flex-col h-full flex-grow-1">
      <ToolBar editor={editor} />
      <EditorContent editor={editor} className="flex-grow-1 h-full" />
    </div>
  );
};

export default JournalsRTE;
