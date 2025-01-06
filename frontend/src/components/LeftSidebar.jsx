import { BookOpen, File, Flame } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

function LeftSidebar() {
  return (
    <div className="bg-zinc-900 w-[20%] h-full text-white rounded-lg p-2">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-xl p-4 font-bold font-serif">Writes</h1>
        <hr className="h-[1px] w-8" />
      </div>

      <div className="flex flex-col justify-center py-6 gap-4">
        <Link to="/" className="px-4">
          <Button
            variant="ghost"
            className="w-full h-12 hover:bg-zinc-800  flex items-center justify-start text-left hover:text-white"
          >
            <Flame />
            Overview
          </Button>
        </Link>

        <Link to="notes" className="px-4">
          <Button
            variant="ghost"
            className="w-full h-12 hover:bg-zinc-800  flex items-center justify-start text-left hover:text-white"
          >
            <File />
            Notes
          </Button>
        </Link>

        <Link to="/journal" className="px-4">
          <Button
            variant="ghost"
            className="w-full h-12 hover:bg-zinc-800  flex items-center justify-start text-left hover:text-white"
          >
            <BookOpen />
            Journal
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default LeftSidebar;
