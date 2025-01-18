import GridEntryBlock from "@/components/journal/GridEntryBlock";
import useFolder from "@/hooks/useFolder";
import React, { useState } from "react";
import { FaFolder } from "react-icons/fa6";
import { useParams } from "react-router-dom";

const FolderPage = () => {
  const { folderId } = useParams();
  const { folder, isLoading, isError } = useFolder(folderId);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState(null);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading folder</div>;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="flex gap-2 items-center pb-4">
        <FaFolder color={folder.colour} />
        {folder.name}
      </h1>
    </div>
  );
};

export default FolderPage;
