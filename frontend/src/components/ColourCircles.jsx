import { Circle } from "lucide-react";
import React from "react";

const ColourCircles = ({ colour, setCustomColour, hexToColor }) => {
  return (
    <Circle
      strokeWidth={1}
      fill={colour}
      className="cursor-pointer"
      onClick={() => {
        setCustomColour(hexToColor(colour));
      }}
    />
  );
};

export default ColourCircles;
