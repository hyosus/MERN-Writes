import { getJournalMood } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const JOURNAL_MOODS = "journal_moods";

const useJournalMoods = (opts) => {
  const { data: journalMoods, ...rest } = useQuery({
    queryKey: [JOURNAL_MOODS],
    queryFn: getJournalMood,
    staleTime: Infinity,
    ...opts,
  });

  return { journalMoods, ...rest };
};

export default useJournalMoods;
