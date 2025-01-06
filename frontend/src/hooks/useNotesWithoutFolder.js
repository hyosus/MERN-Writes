import { getNotesWithoutFolder } from "@/lib/api.js";
import { useQuery } from "@tanstack/react-query";

export const NOTES_WITHOUT_FOLDER = "notesWithoutFolder";

const useNotesWithoutFolder = (opts) => {
  const { data: notes, ...rest } = useQuery({
    queryKey: [NOTES_WITHOUT_FOLDER],
    queryFn: getNotesWithoutFolder,
    ...opts,
  });

  return { notes, ...rest };
};

export default useNotesWithoutFolder;
