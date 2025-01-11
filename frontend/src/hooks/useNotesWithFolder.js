import { getNotesWithFolder } from "@/lib/api.js";
import { useQuery } from "@tanstack/react-query";

export const NOTES_WITH_FOLDER = "notesWithFolder";

const useNotesWithFolder = (folderId, opts) => {
  const { data: notes, ...rest } = useQuery({
    queryKey: [NOTES_WITH_FOLDER],
    queryFn: () => getNotesWithFolder(folderId),
    ...opts,
  });

  return { notes, ...rest };
};

export default useNotesWithFolder;
