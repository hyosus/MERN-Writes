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

const JournalPage = () => {
  const [value, onChange] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const { journalMoods, isLoading, isError } = useJournalMoods();
  const { journals, isLoading: isJournalLoading } = useJournals();

  if (journals) {
    console.log(journals);
  }

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

  const filteredJournals = journals?.filter((journal) =>
    isSameDay(new Date(journal.date), selectedDate)
  );

  const filteredMoods = journalMoods.filter((entry) =>
    isSameDay(new Date(entry.date), selectedDate)
  );

  return (
    <>
      <div className="flex flex-col h-full">
        <Calendar
          onChange={onChange}
          value={value}
          tileContent={tileContent}
          onClickDay={onClickDay}
        />
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
