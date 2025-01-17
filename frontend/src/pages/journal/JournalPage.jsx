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
import useJournals from "@/hooks/useJournal";
import JournalEntryBlock from "@/components/journal/JournalEntryBlock";
import { CalendarIcon, LayoutGrid } from "lucide-react";

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

  // Update localStorage when view changes
  useEffect(() => {
    localStorage.setItem("journalView", view);
  }, [view]);

  const tileContent = ({ date, view }) => {
    if (view === "month" && journalMoods) {
      const journalEntries = journalMoods.filter((entry) =>
        isSameDay(new Date(entry.date), date)
      );
      const allMoods = journalEntries.flatMap((entry) => entry.mood);

      if (allMoods.length > 0) {
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
    return entries?.reduce((acc, entry) => {
      const date = new Date(entry.date);
      const year = date.getFullYear();
      const month = date.toLocaleString("default", { month: "long" });

      if (!acc[year]) {
        acc[year] = {};
      }
      if (!acc[year][month]) {
        acc[year][month] = [];
      }
      acc[year][month].push(entry);
      return acc;
    }, {});
  };

  const groupedEntries = groupEntriesByDate(journals);
  console.log(groupedEntries);

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
            <div className="flex flex-col gap-4">
              {Object.entries(groupedEntries || {}).map(([year, months]) => (
                <div key={year}>
                  <h1 className="text-4xl font-bold">{year}</h1>
                  {Object.entries(months).map(([month, entries]) => (
                    <>
                      <h3 className="text-xl">{month}</h3>
                      <div key={month} className="grid grid-cols-2 gap-4 py-4">
                        {entries.map((entry) => (
                          <Link to={`/journal/${entry._id}`} key={entry._id}>
                            <div className="flex gap-4 cursor-pointer hover:bg-white/5 rounded-lg">
                              <div className="flex border border-white rounded min-h-[80px] px-4 items-center">
                                <h1>{format(new Date(entry.date), "dd")}</h1>
                              </div>
                              <div className="flex flex-col gap-2">
                                <h2>{entry.title}</h2>
                                <p>
                                  {entry.content &&
                                    entry.content.replace(/<[^>]*>?/gm, "")}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </>
                  ))}
                </div>
              ))}
            </div>
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
    </>
  );
};

export default JournalPage;
