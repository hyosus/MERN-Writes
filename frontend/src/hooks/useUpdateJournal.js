import { updateEntry } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

const useUpdateJournal = () => {
  const { mutate, ...rest } = useMutation({
    mutationFn: (data) => updateEntry(data),
  });

  return { updateJournal: mutate, ...rest };
};

export default useUpdateJournal;
