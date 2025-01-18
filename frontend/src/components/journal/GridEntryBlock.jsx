import { format } from "date-fns";
import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { formatContent } from "../../lib/FormatContent.js";
import { Button } from "../ui/button";
import { Ellipsis } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const GridEntryBlock = ({
  groupedEntries,
  setIsDeleteModalOpen,
  handleEllipsisClick,
  setIsFoldersDialogOpen,
}) => {
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
                            <Button
                              variant="ghost"
                              onClick={() => setIsFoldersDialogOpen(true)}
                            >
                              Add to Folder
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => setIsDeleteModalOpen(true)}
                            >
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
    </>
  );
};

export default GridEntryBlock;
