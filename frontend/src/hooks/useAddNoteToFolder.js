import { addNoteToFolder } from "@/lib/api.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NOTES_WITHOUT_FOLDER } from "./useNotesWithoutFolder";

const useAddNoteToFolder = () => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation({
    mutationFn: ({ folderId, noteId, name, type }) =>
      addNoteToFolder({ folderId, note: [noteId], name, type }),
    onSuccess: (_, variables) => {
      const { noteId } = variables;

      // Remove the note from the "notesWithoutFolder" cache
      queryClient.setQueryData([NOTES_WITHOUT_FOLDER], (cache) =>
        cache?.filter((note) => note._id !== noteId)
      );
    },
  });

  return { addNoteToFolder: mutate, ...rest };
};

export default useAddNoteToFolder;
