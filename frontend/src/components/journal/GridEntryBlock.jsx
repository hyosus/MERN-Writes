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
import useUpdateJournal from "@/hooks/useUpdateJournal.js";
import useJournalById from "@/hooks/useJournalById.js";
import useUpdateFolder from "@/hooks/useUpdateFolder.js";

const GridEntryBlock = ({ groupedEntries }) => {
  const location = useLocation();

  const [selectedEntryId, setSelectedEntryId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFoldersDialogOpen, setIsFoldersDialogOpen] = useState(false);
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [isInFolder, setIsInFolder] = useState(false);
  const [folderId, setFolderId] = useState(null);

  const { folders, isLoading: isFoldersLoading } = useJournalFolders();
  const { journal, isLoading, isError } = useJournalById(selectedEntryId);

  const { updateJournal } = useUpdateJournal();
  const { updateFolder } = useUpdateFolder();

  const { deleteEntry } = useDeleteEntry();

  const handleEllipsisClick = useCallback(
    (journalId) => {
      setSelectedEntryId(journalId);
      console.log("journalId", journalId);
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
      if (Array.isArray(prev)) {
        if (prev.includes(folderId)) {
          return prev.filter((id) => id !== folderId);
        } else {
          return [...prev, folderId];
        }
      }
      return [];
    });
  };

  const onFoldersModalClose = () => {
    setIsFoldersDialogOpen(false);
    setSelectedFolders([]);
  };

  const onFoldersModalSubmit = () => {
    updateJournal({
      journalId: selectedEntryId,
      data: {
        folders: selectedFolders,
        date: format(journal.date, "yyyy-MM-dd"),
      },
    });

    const selectedFoldersData = folders.filter((folder) =>
      selectedFolders.includes(folder._id)
    );
    selectedFoldersData.forEach((folder) => handleUpdateFolder(folder));
    setIsFoldersDialogOpen(false);
  };

  const handleUpdateFolder = (folder) => {
    console.log("FOLDER: ", folder);
    const initialJournals = folder.journals || [];
    if (Array.isArray(folder.journals)) {
      if (initialJournals.includes(selectedEntryId)) {
        initialJournals.filter((id) => id !== selectedEntryId);
      } else {
        initialJournals.push(selectedEntryId);
      }
    }

    updateFolder({ folderId: folder._id, data: { journals: initialJournals } });
  };

  const handleRemoveFromFolder = () => {
    // Update the journal to remove the folder
    updateJournal({
      journalId: selectedEntryId,
      data: {
        folders: journal.folders.filter((id) => id !== folderId),
        date: format(journal.date, "yyyy-MM-dd"),
      },
    });

    const folder = folders.find((folder) => folder._id === folderId);

    // Update the folder to remove the journal
    updateFolder({
      folderId,
      data: {
        journals: folder.journals.filter((id) => id !== selectedEntryId),
      },
    });

    setIsFoldersDialogOpen(false);
  };

  // Check current URL path
  useEffect(() => {
    if (location.pathname.includes("/journal/folder")) {
      setIsInFolder(true);
      setFolderId(location.pathname.split("/").pop());
    }
  }, [location.pathname]);

  useEffect(() => {
    if (journal) {
      setSelectedFolders(journal.folders || []);
    }
  }, [selectedEntryId, journal, setSelectedFolders]);

  return (
    <>
      <div className="flex flex-col gap-4">
        {groupedEntries.length > 0 ? (
          <>
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
                          <Link
                            to={`/journal/${entry._id}`}
                            className="flex-1 p-4"
                          >
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
                                  {entry.content &&
                                    formatContent(entry.content)}
                                </p>
                              </div>
                            </div>
                          </Link>

                          <div
                            className=""
                            onClick={(e) => e.stopPropagation()}
                          >
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
          </>
        ) : (
          <p>No entries found</p>
        )}
      </div>

      <FoldersModal
        folders={folders}
        isDialogOpen={isFoldersDialogOpen}
        setIsDialogOpen={onFoldersModalClose}
        handleCheckboxChange={handleCheckboxChange}
        selectedFolders={selectedFolders}
        setSelectedFolders={setSelectedFolders}
        onFoldersModalSubmit={onFoldersModalSubmit}
        selectedEntryId={selectedEntryId}
        journal={journal}
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
