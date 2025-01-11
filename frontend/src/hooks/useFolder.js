import { getFolder } from "@/lib/api.js";
import { useQuery } from "@tanstack/react-query";

export const FOLDER = "folder";

const useFolder = (folderId, opts) => {
  const { data: folder, ...rest } = useQuery({
    queryKey: [FOLDER],
    queryFn: () => getFolder(folderId),
    ...opts,
  });

  return { folder, ...rest };
};

export default useFolder;
