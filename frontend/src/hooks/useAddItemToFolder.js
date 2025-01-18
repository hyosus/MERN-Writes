import { addNoteToFolder, addJournalToFolder } from "@/lib/api.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NOTES_WITHOUT_FOLDER } from "./useNotesWithoutFolder";
import { JOURNALS_WITHOUT_FOLDER } from "./useJournalsWithoutFolder";

const useAddItemToFolder = () => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation({
    mutationFn: ({ folderId, noteId, entryId, name, type }) => {
      if (noteId) {
        return addNoteToFolder({ folderId, note: [noteId], name, type });
      }

      if (entryId) {
        return addJournalToFolder({ folderId, journal: [entryId], name, type });
      }

      throw new Error("Must provide either noteId or entryId");
    },
    onSuccess: (_, variables) => {
      const { noteId, entryId } = variables;

      if (noteId) {
        queryClient.setQueryData([NOTES_WITHOUT_FOLDER], (cache) =>
          cache?.filter((note) => note._id !== noteId)
        );
      }

      if (entryId) {
        queryClient.setQueryData([JOURNALS_WITHOUT_FOLDER], (cache) =>
          cache?.filter((entry) => entry._id !== entryId)
        );
      }
    },
  });

  return { addItemToFolder: mutate, ...rest };
};

export default useAddItemToFolder;
