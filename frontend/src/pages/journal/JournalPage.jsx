import React, { useState } from "react";
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

const JournalPage = () => {
  const [value, onChange] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const { journalMoods, isLoading, isError } = useJournalMoods();

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
          <div>{selectedDate && <div></div>}</div>
          <Link to={`/create-entry/${selectedDate}`} className="w-full">
            <Button className="w-full">Add Entry</Button>
          </Link>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JournalPage;
