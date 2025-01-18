import { createFolder } from "@/lib/api";
import queryClient from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { NOTE_FOLDERS } from "./useNoteFolders";
import { JOURNAL_FOLDERS } from "./useJournalFolders";

const useAddFolder = () => {
  const { mutate, ...rest } = useMutation({
    mutationFn: createFolder,
    onSuccess: () => {
      // Invalidate the cache
      queryClient.invalidateQueries([NOTE_FOLDERS]);
      queryClient.invalidateQueries([JOURNAL_FOLDERS]);
    },
    onError: (error) => {
      console.error("Failed to add folder:", error);
    },
  });

  return { addFolder: mutate, ...rest };
};

export default useAddFolder;
