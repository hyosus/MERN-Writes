import { format } from "date-fns";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { formatContent } from "../../lib/FormatContent.js";
import { Button } from "../ui/button";
import { CircleMinus, CirclePlus, Ellipsis, Trash } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import DeleteEntryModal from "./DeleteEntryModal.jsx";
import useDeleteEntry from "@/hooks/useDeleteEntry.js";
import FoldersModal from "./FoldersModal.jsx";
import useJournalFolders from "@/hooks/useJournalFolders.js";
import useAddItemToFolder from "@/hooks/useAddItemToFolder.js";
import useRemoveJournalFromFolder from "@/hooks/useRemoveJournalFromFolder.js";

const GridEntryBlock = ({ groupedEntries }) => {
  const location = useLocation();

  const [selectedEntryId, setSelectedEntryId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFoldersDialogOpen, setIsFoldersDialogOpen] = useState(false);
  const [selectedFolders, setSelectedFolders] = useState({});
  const [isInFolder, setIsInFolder] = useState(false);
  const [folderId, setFolderId] = useState(null);

  const { folders, isLoading: isFoldersLoading } = useJournalFolders();
  const { addItemToFolder } = useAddItemToFolder();
  const { removeJournalFromFolder } = useRemoveJournalFromFolder();

  const { deleteEntry } = useDeleteEntry();

  const handleEllipsisClick = useCallback(
    (entryId) => {
      setSelectedEntryId(entryId);
      console.log("entryId", entryId);
    },
    [setSelectedEntryId, setIsDeleteModalOpen]
  );

  const handleDelete = () => {
    if (selectedEntryId) {
      deleteEntry(selectedEntryId);
      setIsDeleteModalOpen(false);
    }
  };

  const handleCheckboxChange = (folderId) => {
    setSelectedFolders((prev) => {
      // If folder was checked (true), it becomes unchecked (false)
      // If folder wasn't checked (false/undefined), it becomes checked (true)
      const newState = {
        ...prev,
        [folderId]: !prev[folderId],
      };

      console.log("Selected folders:", newState);
      return newState;
    });
  };

  const onFoldersModalClose = () => {
    setIsFoldersDialogOpen(false);
    setSelectedFolders({});
  };

  const onFoldersModalSubmit = () => {
    Object.entries(selectedFolders).forEach(([folderId, isSelected]) => {
      if (isSelected) {
        console.log("Submitting:", { folderId, selectedEntryId });
        addItemToFolder({
          folderId,
          journalId: selectedEntryId,
        });
      }
    });
    setIsFoldersDialogOpen(false);
  };

  const handleRemoveFromFolder = () => {
    console.log("Removing from folder:", { folderId, selectedEntryId });
    removeJournalFromFolder({ folderId, journalId: selectedEntryId });
    setIsFoldersDialogOpen(false);
  };

  // Check current URL path
  useEffect(() => {
    if (location.pathname.includes("/journal/folder")) {
      setIsInFolder(true);
      setFolderId(location.pathname.split("/").pop());
      console.log("fodlerID, ", folderId);
    }
  }, [location.pathname]);

  return (
    <>
      <div className="flex flex-col gap-4">
        {groupedEntries?.map(({ year, months }) => (
          <div key={year}>
            <h1 className="text-4xl ">{year}</h1>
            {months.map(({ month, entries }) => (
              <div key={month}>
                <h3 className="text-xl">{month}</h3>
                <div className="grid grid-cols-2 gap-6 pt-3 pb-8">
                  {entries.map((entry) => (
                    <div
                      key={entry._id}
                      className="flex cursor-pointer hover:bg-white/5 rounded-lg translate-x-[-1rem]"
                    >
                      <Link to={`/journal/${entry._id}`} className="flex-1 p-4">
                        <div className="flex gap-4 ">
                          <div className="flex border border-white rounded min-h-[80px] px-4 items-center">
                            <h1>{format(new Date(entry.date), "dd")}</h1>
                          </div>
                          <div className="flex flex-col gap-2 text-ellipsis line-clamp-1">
                            <h2 className="truncate">
                              {entry.title
                                ? entry.title
                                : formatContent(entry.content)}
                            </h2>
                            <p className="overflow-hidden text-ellipsis line-clamp-2 break-words">
                              {entry.content && formatContent(entry.content)}
                            </p>
                          </div>
                        </div>
                      </Link>

                      <div className="" onClick={(e) => e.stopPropagation()}>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="icon"
                              onClick={() => {
                                handleEllipsisClick(entry._id);
                              }}
                            >
                              <Ellipsis />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-fit flex flex-col gap-4">
                            {isInFolder ? (
                              <Button
                                className="w-full h-12 flex items-center justify-start text-md text-left"
                                variant="ghost"
                                onClick={() => handleRemoveFromFolder()}
                              >
                                <CircleMinus />
                                Remove from Folder
                              </Button>
                            ) : (
                              <Button
                                className="w-full h-12 flex items-center justify-start text-md text-left"
                                variant="ghost"
                                onClick={() => setIsFoldersDialogOpen(true)}
                              >
                                <CirclePlus />
                                Add to Folder
                              </Button>
                            )}

                            <Button
                              className="w-full h-12 flex items-center justify-start text-md text-left"
                              variant="destructive"
                              onClick={() => setIsDeleteModalOpen(true)}
                            >
                              <Trash />
                              Delete
                            </Button>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <FoldersModal
        folders={folders}
        isDialogOpen={isFoldersDialogOpen}
        setIsDialogOpen={onFoldersModalClose}
        handleCheckboxChange={handleCheckboxChange}
        selectedFolders={selectedFolders}
        onFoldersModalSubmit={onFoldersModalSubmit}
      />

      <DeleteEntryModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        selectedEntryId={selectedEntryId}
        handleDelete={handleDelete}
      />
    </>
  );
};

export default GridEntryBlock;
