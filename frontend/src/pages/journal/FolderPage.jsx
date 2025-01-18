import EditFolderModal from "@/components/EditFolderModal";
import GridEntryBlock from "@/components/journal/GridEntryBlock";
import { Input } from "@/components/ui/input";
import useFolder from "@/hooks/useFolder";
import useJournalsInFolder from "@/hooks/useJournalsInFolder";
import useUpdateFolder from "@/hooks/useUpdateFolder";
import groupEntriesByDate from "@/lib/groupJournals";
import React, { useEffect, useRef, useState } from "react";
import { useColor } from "react-color-palette";
import { FaFolder } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { hexToColor } from "./CreateEntryPage";
import useClickOutside from "@/hooks/useClickOutside";
import { defaultPastelColours } from "@/constants/Colours.js";

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
  const defaultColours = defaultPastelColours;

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
        name: editedName.trim(),
      });
    }

    if (customColour.hex !== folder.colour) {
      updateFolder({
        folderId: folderId,
        colour: customColour.hex,
      });
    }
    setIsEditing(false);
    setIsDialogOpen(false);
  };

  if (isLoading || isLoadingJournals) return <div>Loading...</div>;
  if (isError || isErrorJournals) return <div>Error loading folder</div>;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="flex gap-2 items-center pb-4">
        <FaFolder
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
            className="cursor-pointer hover:opacity-80"
          >
            {folder.name}
          </span>
        )}
      </h1>

      <GridEntryBlock groupedEntries={groupEntriesByDate(journals)} />
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
    </div>
  );
};

export default FolderPage;
