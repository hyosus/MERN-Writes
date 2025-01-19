import { getJournal } from "@/lib/api.js";
import { useQuery } from "@tanstack/react-query";

export const JOURNAL = "journal";

const useJournalById = (journalId, opts) => {
  const { data: journal, ...rest } = useQuery({
    queryKey: [JOURNAL, journalId],
    queryFn: () => getJournal(journalId),
    enabled: !!journalId, // Only run query if journalId is truthy
    ...opts,
  });

  return { journal, ...rest };
};

export default useJournalById;
