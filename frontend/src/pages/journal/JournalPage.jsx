import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./customCalendar.css";
import useJournalMoods from "@/hooks/useJournalMood";
import { FaHeart } from "react-icons/fa6";
import { format, isSameDay } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import useJournals, { JOURNALS } from "@/hooks/useJournal";
import JournalEntryBlock from "@/components/journal/JournalEntryBlock";
import { ArrowUpDown, CalendarIcon, Heart, LayoutGrid } from "lucide-react";
import GridEntryBlock from "@/components/journal/GridEntryBlock";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useMutation } from "@tanstack/react-query";
import { deleteEntry } from "@/lib/api.js";
import queryClient from "@/lib/queryClient";
import DeleteEntryModal from "@/components/journal/DeleteEntryModal";
import useDeleteEntry from "@/hooks/useDeleteEntry";

const JournalPage = () => {
  const [value, onChange] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = useState(() => {
    // get from local storage or default to Calendar
    return localStorage.getItem("journalView") || "Calendar";
  });
  const { journalMoods, isLoading, isError } = useJournalMoods();
  const { journals, isLoading: isJournalLoading } = useJournals();
  const [sortDirection, setSortDirection] = useState("desc");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState(null);
  const { deleteEntry } = useDeleteEntry();
  // Update localStorage when view changes
  useEffect(() => {
    localStorage.setItem("journalView", view);
  }, [view]);

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      // Check for journal entries on this date
      const hasEntries = journals?.some((entry) =>
        isSameDay(new Date(entry.date), date)
      );

      // Check for mood entries
      const journalEntries = journalMoods?.filter((entry) =>
        isSameDay(new Date(entry.date), date)
      );
      const allMoods = journalEntries?.flatMap((entry) => entry.mood);

      if (allMoods?.length > 0) {
        return (
          <div className="absolute top-0 left-0 flex items-end justify-center w-full h-full gap-1 p-3">
            {allMoods.map((moodItem, index) => (
              <FaHeart
                key={index}
                size="20%"
                style={{ color: moodItem.colour }}
              />
            ))}
          </div>
        );
      } else if (hasEntries) {
        return (
          <div className="absolute top-0 left-0 flex items-end justify-center w-full h-full p-3">
            <Heart size={"20%"} />
          </div>
        );
      }
    }
    return null;
  };

  const onClickDay = (date) => {
    setSelectedDate(date);
    setIsDialogOpen(true);
  };

  // Filter journals by selected date
  const filteredJournals = journals?.filter((journal) =>
    isSameDay(new Date(journal.date), selectedDate)
  );

  const filteredMoods =
    journalMoods?.filter((entry) =>
      isSameDay(new Date(entry.date), selectedDate)
    ) || [];

  // Creates structure: { year: { month: [entries] } }
  const groupEntriesByDate = (entries) => {
    if (!entries) return {};

    const grouped = entries.reduce((acc, entry) => {
      const date = new Date(entry.date);
      const year = date.getFullYear();
      const month = date.toLocaleString("default", { month: "long" });

      if (!acc[year]) acc[year] = {};
      if (!acc[year][month]) acc[year][month] = [];
      acc[year][month].push(entry);
      return acc;
    }, {});

    // Sort by year
    const sortedYears = Object.keys(grouped).sort((a, b) => {
      if (sortDirection === "desc") {
        return parseInt(b) - parseInt(a);
      } else {
        return parseInt(a) - parseInt(b);
      }
    });

    // Create a new array with sorted entries
    const sortedGroupedEntries = sortedYears.map((year) => ({
      year,
      months: Object.entries(grouped[year]).map(([month, entries]) => ({
        month,
        entries,
      })),
    }));

    return sortedGroupedEntries;
  };

  const handleDelete = () => {
    if (selectedEntryId) {
      deleteEntry(selectedEntryId);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full w-full gap-4">
        <div className="flex w-full justify-center gap-4">
          <Button
            size="icon"
            variant="outline"
            className={`${view === "Calendar" && "bg-white/40"}`}
            onClick={() => setView("Calendar")}
          >
            <CalendarIcon />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className={`${view === "Grid" && "bg-white/40"}`}
            onClick={() => setView("Grid")}
          >
            <LayoutGrid />
          </Button>
          {view === "Grid" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <ArrowUpDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Sort by year</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={sortDirection}
                  onValueChange={setSortDirection}
                >
                  <DropdownMenuRadioItem value="desc">
                    Descending
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="asc">
                    Ascending
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {view === "Calendar" ? (
          <Calendar
            onChange={onChange}
            value={value}
            tileContent={tileContent}
            onClickDay={onClickDay}
          />
        ) : (
          <>
            {isJournalLoading ? (
              <div>Loading journals...</div>
            ) : journals ? (
              (console.log("2. Entry id: ", selectedEntryId),
              (
                <GridEntryBlock
                  groupedEntries={groupEntriesByDate(journals)}
                  isDeleteModalOpen={isDeleteModalOpen}
                  setIsDeleteModalOpen={setIsDeleteModalOpen}
                  selectedEntryId={selectedEntryId}
                  setSelectedEntryId={setSelectedEntryId}
                />
              ))
            ) : (
              <div>No entries found</div>
            )}
          </>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDate && format(selectedDate, "PPP")}
            </DialogTitle>
          </DialogHeader>
          <div>
            {isJournalLoading ? (
              <p>Loading journals...</p>
            ) : filteredJournals && filteredJournals.length > 0 ? (
              <div className="flex flex-col gap-2">
                {filteredJournals.map((journal) => (
                  <Link to={`/journal/${journal._id}`} key={journal._id}>
                    <JournalEntryBlock
                      key={journal._id}
                      journal={journal}
                      filteredMoods={filteredMoods}
                      journalView={view}
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <p>No entries for this date</p>
            )}
          </div>
          <Link to={`/create-entry/${selectedDate}`} className="w-full">
            <Button className="w-full">Add Entry</Button>
          </Link>
        </DialogContent>
      </Dialog>

      <DeleteEntryModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        selectedEntryId={selectedEntryId}
        handleDelete={handleDelete}
      />
    </>
  );
};

export default JournalPage;
