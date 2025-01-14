import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./customCalendar.css";
import useJournalMoods from "@/hooks/useJournalMood";

const JournalPage = () => {
  const [value, onChange] = useState(new Date());
  const { journalMoods, isLoading, isError } = useJournalMoods();

  const tileContent = ({ date, view }) => {
    if (view === "month" && journalMoods) {
      const mood = journalMoods.find(
        (mood) => mood.date.split("T")[0] === date.toISOString().split("T")[0]
      );
      if (mood) {
        return (
          <div
            style={{
              backgroundColor: mood.mood.colour,
              width: "100%",
              height: "100%",
            }}
          ></div>
        );
      }
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full">
      <Calendar onChange={onChange} value={value} tileContent={tileContent} />
    </div>
  );
};

export default JournalPage;
