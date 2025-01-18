import { deleteFolder } from "@/lib/api.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { JOURNAL_FOLDERS } from "./useJournalFolders";
import { NOTE_FOLDERS } from "./useNoteFolders";
import { useNavigate } from "react-router-dom";

const useDeleteFolder = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, ...rest } = useMutation({
    mutationFn: (folderId) => deleteFolder(folderId),

    onSuccess: () => {
      queryClient.invalidateQueries([JOURNAL_FOLDERS]);
      queryClient.invalidateQueries([NOTE_FOLDERS]);
      navigate("/journal");
    },
  });

  return { deleteFolder: mutate, ...rest };
};

export default useDeleteFolder;
