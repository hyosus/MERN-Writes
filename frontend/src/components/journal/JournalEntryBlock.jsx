import React from "react";
import { formatContent } from "../../lib/FormatContent.js";
import { FaHeart } from "react-icons/fa6";
import { Heart } from "lucide-react";

const JournalEntryBlock = ({ journal, filteredMoods }) => {
  const getColour = (jmood) => {
    const mood = filteredMoods[0].mood.find((m) => m._id === jmood);
    if (mood) {
      return (
        <Heart key={jmood} size={20} fill={mood.colour} color={mood.colour} />
      );
    }
    return null;
  };

  const formattedContent = journal.content && formatContent(journal.content);

  return (
    <>
      <div key={journal._id} className="flex gap-4 p-2 border rounded">
        <div className="flex flex-wrap w-14 gap-1 pt-2">
          {journal.mood.length > 0 ? (
            journal.mood.map((mood) => getColour(mood))
          ) : (
            <FaHeart />
          )}
        </div>
        <div>
          <h1>{journal.title}</h1>
          <p>{formattedContent}</p>
        </div>
      </div>
    </>
  );
};

export default JournalEntryBlock;
