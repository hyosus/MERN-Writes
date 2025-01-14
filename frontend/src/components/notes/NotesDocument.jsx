import useNotesWithoutFolder from "@/hooks/useNotesWithoutFolder";
import { ScrollArea } from "../ui/scroll-area";
import { Link } from "react-router-dom";

const NotesDocument = ({ filter }) => {
  const { notes, isLoading, isError } = useNotesWithoutFolder();

  const handleDragStart = (e, noteId) => {
    e.dataTransfer.setData("noteId", noteId);
  };

  const NoteBlock = ({ note }) => {
    const formattedDate = new Date(note.createdAt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const formattedContent =
      note.content && note.content.replace(/<[^>]*>?/gm, "");

    return (
      <Link to={`/notes/${note._id}`}>
        <li draggable onDragStart={(e) => handleDragStart(e, note._id)}>
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
    <>
      <h1 className="text-2xl font-bold py-4">Documents</h1>

      <ScrollArea
        className={filter === "Document" ? "flex-grow" : "flex-grow h-fit"}
      >
        {isLoading && <p>Loading...</p>}
        {notes && notes.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {notes.map((note) => (
              <NoteBlock key={note.id} note={note} />
            ))}
          </ul>
        ) : (
          <p>No notes found</p>
        )}
      </ScrollArea>
    </>
  );
};

export default NotesDocument;
