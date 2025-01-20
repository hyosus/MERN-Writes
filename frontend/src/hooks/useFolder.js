import { getFolder } from "@/lib/api.js";
import { useQuery } from "@tanstack/react-query";

export const FOLDER = "folder";

const useFolder = (folderId, opts) => {
  const { data: folder, ...rest } = useQuery({
    queryKey: [FOLDER, folderId],
    queryFn: () => getFolder(folderId),
    staleTime: 0,
    ...opts,
  });

  return { folder, ...rest };
};

export default useFolder;
