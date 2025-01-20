import EditFolderModal from "@/components/EditFolderModal";
import GridEntryBlock from "@/components/journal/GridEntryBlock";
import { Input } from "@/components/ui/input";
import useFolder from "@/hooks/useFolder";
import useJournalsInFolder from "@/hooks/useJournalsInFolder";
import useUpdateFolder from "@/hooks/useUpdateFolder";
import groupEntriesByDate from "@/lib/groupJournals";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useColor } from "react-color-palette";
import { FaFolder } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { hexToColor } from "./CreateEntryPage";
import useClickOutside from "@/hooks/useClickOutside";
import { defaultPastelColours } from "@/constants/Colours.js";
import { Ellipsis, Trash } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import DeleteFolderModal from "@/components/DeleteFolderModal";
import useDeleteFolder from "@/hooks/useDeleteFolder";

const FolderPage = () => {
  const { folderId } = useParams();
  const { folder, isLoading, isError } = useFolder(folderId);
  const { updateFolder } = useUpdateFolder();

  const {
    journals,
    isLoading: isLoadingJournals,
    isError: isErrorJournals,
  } = useJournalsInFolder(folderId);

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customColour, setCustomColour] = useColor("#FFFFFF");
  const [showColourPicker, setShowColourPicker] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState(null);
  const [isFoldersDialogOpen, setIsFoldersDialogOpen] = useState(false);
  const sortDirection = localStorage.getItem("sortDirection") || "desc";

  const defaultColours = defaultPastelColours;
  const { deleteFolder } = useDeleteFolder();

  const colorPickerRef = useRef(null);
  useClickOutside(colorPickerRef, () => setShowColourPicker(false));

  useEffect(() => {
    folder && setCustomColour(hexToColor(folder.colour));
  }, [folder]);

  const handleEdit = () => {
    setEditedName(folder.name);
    setIsEditing(true);
  };

  const handleSave = () => {
    console.log(folderId);

    if (editedName.trim() !== folder.name) {
      updateFolder({
        folderId: folderId,
        data: {
          name: editedName.trim(),
        },
      });
    }

    if (customColour.hex !== folder.colour) {
      updateFolder({
        folderId: folderId,
        data: {
          colour: customColour.hex,
        },
      });
    }
    setIsEditing(false);
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (folderId) {
      deleteFolder(folderId);
      setIsDeleteModalOpen(false);
    }
  };

  const handleEllipsisClick = useCallback(
    (journalId) => {
      setSelectedEntryId(journalId);
      console.log("journalId", journalId);
    },
    [setSelectedEntryId, setIsDeleteModalOpen]
  );

  if (isLoading || isLoadingJournals) return <div>Loading...</div>;
  if (isError || isErrorJournals) return <div>Error loading folder</div>;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="flex gap-2 items-center pb-4">
        <FaFolder
          className="cursor-pointer hover:opacity-80"
          color={folder.colour}
          onClick={() => {
            setIsDialogOpen(true);
          }}
        />
        {isEditing ? (
          <Input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            className="w-fit"
            autoFocus
          />
        ) : (
          <span
            onClick={handleEdit}
            className="cursor-pointer hover:opacity-80 pr-5"
          >
            {folder.name}
          </span>
        )}

        <Popover>
          <PopoverTrigger asChild>
            <Ellipsis size={25} className="cursor-pointer" />
          </PopoverTrigger>
          <PopoverContent className="w-fit flex flex-col gap-4">
            {/* <Button
              variant="ghost"
              onClick={() => setIsFoldersDialogOpen(true)}
            >
              Add to Folder
            </Button> */}
            <Button
              variant="destructive"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <Trash />
              Delete
            </Button>
          </PopoverContent>
        </Popover>
      </h1>

      <GridEntryBlock
        groupedEntries={groupEntriesByDate(journals, sortDirection)}
        handleEllipsisClick={handleEllipsisClick}
        setIsFoldersDialogOpen={setIsFoldersDialogOpen}
      />

      <EditFolderModal
        defaultColours={defaultColours}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        setCustomColour={setCustomColour}
        customColour={customColour}
        showColourPicker={showColourPicker}
        setShowColourPicker={setShowColourPicker}
        colorPickerRef={colorPickerRef}
        handleSave={handleSave}
      />

      <DeleteFolderModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default FolderPage;
