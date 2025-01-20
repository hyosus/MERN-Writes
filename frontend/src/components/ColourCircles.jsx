import { hexToColor } from "@/pages/journal/CreateEntryPage";
import { Circle, CirclePlus } from "lucide-react";
import React from "react";

const ColourCircles = ({
  defaultColours,
  setCustomColour,
  setShowColourPicker,
  showColourPicker,
}) => {
  return (
    <div className="flex gap-2">
      {defaultColours.map((colour) => (
        <Circle
          strokeWidth={1}
          fill={colour}
          className="cursor-pointer"
          onClick={() => {
            setCustomColour(hexToColor(colour));
          }}
        />
      ))}
      <CirclePlus
        onClick={(e) => {
          e.stopPropagation();
          setShowColourPicker(!showColourPicker);
        }}
      />
    </div>
  );
};

export default ColourCircles;
