import React from "react";
import { Button } from "./ui/button";

const PeriodFilterBar = ({ period, setPeriod }) => {
  const clickHandler = (e) => {
    setPeriod(e.target.innerText);
  };
  return (
    <div className="flex flex-shrink-0 gap-4">
      <Button
        className={`rounded-2xl px-6 ${
          period === "1 Month"
            ? "bg-white text-black hover:bg-white hover:text-black"
            : "bg-white/20 hover:bg-white hover:text-black"
        }`}
        onClick={clickHandler}
      >
        1 Month
      </Button>
      <Button
        className={`rounded-2xl px-6 ${
          period === "3 Months"
            ? "bg-white text-black hover:bg-white hover:text-black"
            : "bg-white/20 hover:bg-white hover:text-black"
        }`}
        onClick={clickHandler}
      >
        3 Months
      </Button>
      <Button
        className={`rounded-2xl px-6 ${
          period === "6 Months"
            ? "bg-white text-black hover:bg-white hover:text-black"
            : "bg-white/20 hover:bg-white hover:text-black"
        }`}
        onClick={clickHandler}
      >
        6 Months
      </Button>
      <Button
        className={`rounded-2xl px-6 ${
          period === "1 Year"
            ? "bg-white text-black hover:bg-white hover:text-black"
            : "bg-white/20 hover:bg-white hover:text-black"
        }`}
        onClick={clickHandler}
      >
        1 Year
      </Button>
    </div>
  );
};

export default PeriodFilterBar;
