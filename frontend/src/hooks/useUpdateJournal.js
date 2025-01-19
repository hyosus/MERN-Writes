import { updateEntry } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { JOURNAL } from "./useJournalById";
import { JOURNALS_IN_FOLDER } from "./useJournalsInFolder";

const useUpdateJournal = () => {
  const { mutate, ...rest } = useMutation({
    mutationFn: (data) => updateEntry(data),
    onSuccess: () => {
      queryClient.invalidateQueries([JOURNAL]);
      queryClient.invalidateQueries([JOURNALS_IN_FOLDER]);
    },
  });

  return { updateJournal: mutate, ...rest };
};

export default useUpdateJournal;
