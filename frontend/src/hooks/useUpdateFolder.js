import { FOLDER } from "./useFolder";
import queryClient from "@/lib/queryClient";
import { updateFolder } from "@/lib/api.js";
import { useMutation } from "@tanstack/react-query";

const useUpdateFolder = (folderId, name, colour) => {
  const { mutate, ...rest } = useMutation({
    mutationFn: ({ folderId, name, colour }) =>
      updateFolder({ folderId, name, colour }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries([FOLDER, variables.folderId]);
    },
  });

  return { updateFolder: mutate, ...rest };
};

export default useUpdateFolder;
