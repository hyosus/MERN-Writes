import { getJournalFolder } from "@/lib/api.js";
import { useQuery } from "@tanstack/react-query";

export const JOURNAL_FOLDERS = "journal_folders";

const useJournalFolders = (opts) => {
  const { data: folders, ...rest } = useQuery({
    queryKey: [JOURNAL_FOLDERS],
    queryFn: getJournalFolder,
    ...opts,
  });

  return { folders, ...rest };
};

export default useJournalFolders;
