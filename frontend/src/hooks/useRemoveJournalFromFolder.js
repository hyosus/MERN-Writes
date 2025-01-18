import { removeJournalFromFolder } from "@/lib/api";
import queryClient from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { JOURNALS_IN_FOLDER } from "./useJournalsInFolder";

const useRemoveJournalFromFolder = () => {
  const { mutate, ...rest } = useMutation({
    mutationFn: ({ folderId, journalId }) =>
      removeJournalFromFolder({ folderId, journalId }),
    onSuccess: (_, { folderId }) => {
      queryClient.invalidateQueries([JOURNALS_IN_FOLDER], folderId);
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });

  return { removeJournalFromFolder: mutate, ...rest };
};

export default useRemoveJournalFromFolder;
