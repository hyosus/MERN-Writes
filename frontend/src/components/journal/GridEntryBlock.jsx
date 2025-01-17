import { format } from "date-fns";
import React from "react";
import { Link } from "react-router-dom";
import { formatContent } from "../FormatContent";

const GridEntryBlock = ({ groupedEntries }) => {
  return (
    <div className="flex flex-col gap-4">
      {groupedEntries?.map(({ year, months }) => (
        <div key={year}>
          <h1 className="text-4xl ">{year}</h1>
          {months.map(({ month, entries }) => (
            <div key={month} className="space-y-2">
              <h3 className="text-xl">{month}</h3>
              <div className="grid grid-cols-2 gap-4 py-4">
                {entries.map((entry) => (
                  <Link to={`/journal/${entry._id}`} key={entry._id}>
                    <div className="flex gap-4 cursor-pointer hover:bg-white/5 rounded-lg">
                      <div className="flex border border-white rounded min-h-[80px] px-4 items-center">
                        <h1>{format(new Date(entry.date), "dd")}</h1>
                      </div>
                      <div className="flex flex-col gap-2">
                        <h2>
                          {entry.title
                            ? entry.title
                            : formatContent(entry.content)}
                        </h2>
                        <p>{entry.content && formatContent(entry.content)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GridEntryBlock;
