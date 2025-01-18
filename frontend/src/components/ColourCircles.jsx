import { defaultColours } from "@/constants/Colours";
import { hexToColor } from "@/pages/journal/CreateEntryPage";
import { Circle, CirclePlus } from "lucide-react";
import React from "react";

const ColourCircles = ({
  setCustomColour,
  setShowColorPicker,
  showColorPicker,
}) => {
  return (
    <div className="flex gap-2">
      {defaultColours.map((colour) => (
        <Circle
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
          setShowColorPicker(!showColorPicker);
        }}
      />
    </div>
  );
};

export default ColourCircles;
