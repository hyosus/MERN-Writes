import { getAllEntries } from "@/lib/api.js";
import { useQuery } from "@tanstack/react-query";

export const JOURNALS = "journals";

const useJournals = (opts) => {
  const { data: journals, ...rest } = useQuery({
    queryKey: [JOURNALS],
    queryFn: getAllEntries,
    staleTime: Infinity,
    ...opts,
  });

  return { journals, ...rest };
};

export default useJournals;
