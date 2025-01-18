import { BookOpen, ChevronLeft, File, Flame } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import JournalSideBar from "./JournalSideBar";

function LeftSidebar() {
  // Initialize state from localStorage
  const [selection, setSelection] = useState(() => {
    return localStorage.getItem("sidebarSelection") || "";
  });

  // Update localStorage on state change
  useEffect(() => {
    localStorage.setItem("sidebarSelection", selection);
  }, [selection]);

  return (
    <div className="flex flex-col flex-shrink-0 items-center bg-zinc-900 w-[20%] h-full text-white rounded-lg p-4">
      <div className="flex items-center justify-between">
        {selection === "journal" && (
          <Button
            onClick={() => {
              setSelection("");
            }}
            variant="ghost"
            size="icon"
          >
            <ChevronLeft />
          </Button>
        )}
        <div className="flex flex-col items-center justify-center flex-grow">
          <h1 className="text-xl p-4 font-bold font-serif">Writes</h1>
          <hr className="h-[1px] w-8 border-white" />
        </div>
        {/* Placeholder to balance the chevron */}
        {selection === "journal" && (
          <Button disabled variant="ghost" size="icon" />
        )}
      </div>

      <div className="flex flex-col w-full justify-center py-6 gap-4">
        {selection === "journal" ? (
          <JournalSideBar />
        ) : (
          <>
            <Link to="/">
              <Button
                variant="ghost"
                className="w-full h-12 hover:bg-zinc-800  flex items-center justify-start text-left hover:text-white"
              >
                <Flame />
                Overview
              </Button>
            </Link>

            <Link to="/notes">
              <Button
                variant="ghost"
                className="w-full h-12 hover:bg-zinc-800  flex items-center justify-start text-left hover:text-white"
              >
                <File />
                Notes
              </Button>
            </Link>

            <Link to="/journal">
              <Button
                onClick={() => setSelection("journal")}
                variant="ghost"
                className="w-full h-12 hover:bg-zinc-800  flex items-center justify-start text-left hover:text-white"
              >
                <BookOpen />
                Journal
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default LeftSidebar;
