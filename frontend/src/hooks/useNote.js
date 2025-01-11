import { getNote } from "@/lib/api.js";
import { useQuery } from "@tanstack/react-query";

export const NOTE = "note";

const useNote = (noteId, opts) => {
  const { data: note, ...rest } = useQuery({
    queryKey: [NOTE],
    queryFn: () => getNote(noteId),
    ...opts,
  });

  return { note, ...rest };
};

export default useNote;
