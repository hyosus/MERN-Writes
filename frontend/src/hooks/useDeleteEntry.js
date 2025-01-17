import { deleteEntry } from "@/lib/api.js";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { JOURNALS } from "@/hooks/useJournal";

const useDeleteEntry = () => {
  const queryClient = useQueryClient();
  const { mutate, ...rest } = useMutation({
    mutationFn: (entryId) => deleteEntry(entryId),
    onSuccess: (_, entryId) => {
      queryClient.setQueryData([JOURNALS], (cache) =>
        cache.filter((entry) => entry._id !== entryId)
      );
    },
  });

  return { deleteEntry: mutate, ...rest };
};

export default useDeleteEntry;
