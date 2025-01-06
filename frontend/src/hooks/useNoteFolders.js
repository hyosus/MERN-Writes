import { getNoteFolders } from "@/lib/api.js";
import { useQuery } from "@tanstack/react-query";

export const NOTE_FOLDERS = "note_folders";

const useNoteFolders = (opts) => {
  const { data: folders, ...rest } = useQuery({
    queryKey: [NOTE_FOLDERS],
    queryFn: getNoteFolders,
    staleTime: Infinity,
    ...opts,
  });

  return { folders, ...rest };
};

export default useNoteFolders;
