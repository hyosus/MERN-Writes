import { FOLDER } from "./useFolder";
import queryClient from "@/lib/queryClient";
import { updateFolder } from "@/lib/api.js";
import { useMutation } from "@tanstack/react-query";

const useUpdateFolder = () => {
  const { mutate, ...rest } = useMutation({
    mutationFn: (data) => updateFolder(data),
  });

  return { updateFolder: mutate, ...rest };
};

export default useUpdateFolder;
