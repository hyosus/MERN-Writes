import { addNoteToFolder, addJournalToFolder } from "@/lib/api.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NOTES_WITHOUT_FOLDER } from "./useNotesWithoutFolder";

const useAddItemToFolder = () => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation({
    mutationFn: ({ folderId, noteId, journalId }) => {
      console.log("Mutation called with:", { folderId, noteId, journalId });

      if (noteId) {
        return addNoteToFolder({ folderId, note: [noteId] });
      }

      if (journalId) {
        return addJournalToFolder({
          folderId,
          journalId,
          journal: [journalId], // Add as array for folderController
        });
      }

      throw new Error("Must provide either noteId or journalId");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["folders"]);
      queryClient.invalidateQueries(["journals"]);
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });

  return { addItemToFolder: mutate, ...rest };
};

export default useAddItemToFolder;
