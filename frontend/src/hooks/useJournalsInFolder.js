import { getEntriesWithFolder } from "@/lib/api.js";
import { useQuery } from "@tanstack/react-query";

export const JOURNALS_IN_FOLDER = "journals_in_folder";

const useJournalsInFolder = (folderId, opts) => {
  const { data: journals, ...rest } = useQuery({
    queryKey: [JOURNALS_IN_FOLDER, folderId],
    queryFn: () => getEntriesWithFolder(folderId),
    staleTime: 0,
    ...opts,
  });

  return { journals, ...rest };
};

export default useJournalsInFolder;
