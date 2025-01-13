import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./customCalendar.css";

const JournalPage = () => {
  const [value, onChange] = useState(new Date());

  return (
    <div className="h-full">
      <Calendar onChange={onChange} value={value} />
    </div>
  );
};

export default JournalPage;
