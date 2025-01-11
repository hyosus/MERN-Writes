import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useCurrentEditor } from "@tiptap/react";
import { Bold, Check, ChevronDown, Italic, Strikethrough } from "lucide-react";

export const ToolBar = ({ editor }) => {
  // const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  const getCurrentStyle = () => {
    if (editor.isActive("heading", { level: 1 })) return "Heading 1";
    if (editor.isActive("heading", { level: 2 })) return "Heading 2";
    if (editor.isActive("heading", { level: 3 })) return "Heading 3";
    if (editor.isActive("heading", { level: 4 })) return "Heading 4";
    if (editor.isActive("paragraph")) return "Paragraph";
    return "Paragraph"; // Default style
  };

  return (
    <div className="flex flex-shrink-0 items-start gap-3 pb-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "bg-white text-black" : ""}
      >
        <Bold />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "bg-white text-black" : ""}
      >
        <Italic />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "bg-white text-black" : ""}
      >
        <Strikethrough />
      </Button>

      {/* Text styles */}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline">
            <span>{getCurrentStyle()}</span>
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit">
          <DropdownMenuItem>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => editor.chain().focus().setParagraph().run()}
            >
              <span className="inline-block w-4">
                {editor.isActive("paragraph") ? <Check /> : ""}
              </span>
              <p>Paragraph</p>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
            >
              <span className="inline-block w-4">
                {editor.isActive("heading", { level: 1 }) ? <Check /> : ""}
              </span>{" "}
              <h1>Heading 1</h1>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              <span className="inline-block w-4">
                {editor.isActive("heading", { level: 2 }) ? <Check /> : ""}
              </span>{" "}
              <h2>Heading 2</h2>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
            >
              <span className="inline-block w-4">
                {editor.isActive("heading", { level: 3 }) ? <Check /> : ""}
              </span>
              <h3>Heading 3</h3>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 4 }).run()
              }
            >
              <span className="inline-block w-4">
                {editor.isActive("heading", { level: 4 }) ? <Check /> : ""}
              </span>
              <h4>Heading 4</h4>
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
