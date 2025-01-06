import { EditorProvider } from "@tiptap/react";
import { MenuBar } from "./Toolbar";
import StarterKit from "@tiptap/starter-kit";

export const RichTextEditor = () => {
  const extensions = [StarterKit];

  const content = `
    <p>Hello</p>
    `;

  return (
    <EditorProvider
      slotBefore={<MenuBar />}
      extensions={extensions}
      content={content}
    />
  );
};
