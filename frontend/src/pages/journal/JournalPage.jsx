import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./customCalendar.css";
import useJournalMoods from "@/hooks/useJournalMood";
import { FaHeart } from "react-icons/fa6";
import { format, isSameDay, set } from "date-fns";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import useJournals from "@/hooks/useJournal";
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
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import FAB from "@/components/FAB";
import useAddFolder from "@/hooks/useAddFolder";
import groupEntriesByDate from "@/lib/groupJournals";

const JournalPage = () => {
  const [value, onChange] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFABDialogOpen, setIsFABDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const { journalMoods, isLoading, isError } = useJournalMoods();
  const { journals, isLoading: isJournalLoading } = useJournals();
  const { addFolder } = useAddFolder();
  const [folderName, setFolderName] = useState("");

  const [view, setView] = useState(() => {
    // get from local storage or default to Calendar
    return localStorage.getItem("journalView") || "Calendar";
  });

  const [sortDirection, setSortDirection] = useState(() => {
    return localStorage.getItem("sortDirection") || "desc";
  });

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

  // Update localStorage when view changes
  useEffect(() => {
    localStorage.setItem("journalView", view);
  }, [view]);

  useEffect(() => {
    localStorage.setItem("sortDirection", sortDirection);
  }, [sortDirection]);

  if (isLoading || isJournalLoading) return <div>Loading...</div>;

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
              <GridEntryBlock
                groupedEntries={groupEntriesByDate(journals, sortDirection)}
              />
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

      <FAB
        isDialogOpen={isFABDialogOpen}
        setIsDialogOpen={setIsFABDialogOpen}
        date={new Date()}
        addFolder={addFolder}
        folderType="Journal"
        folderName={folderName}
        setFolderName={setFolderName}
      />
    </>
  );
};

export default JournalPage;
