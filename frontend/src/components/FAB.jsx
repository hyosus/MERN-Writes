import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { BookOpen, Circle, CirclePlus, Folder, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { defaultColours, defaultPastelColours } from "@/constants/Colours";
import { ColorPicker, useColor } from "react-color-palette";
import { hexToColor } from "@/pages/journal/CreateEntryPage";
import ColourCircles from "./ColourCircles";
import { useRef, useState } from "react";
import useClickOutside from "@/hooks/useClickOutside";
import { FaFolder } from "react-icons/fa6";

const FAB = ({
  folderType,
  isDialogOpen,
  setIsDialogOpen,
  addFolder,
  date,
  folderName,
  setFolderName,
}) => {
  const [customColour, setCustomColour] = useColor("#FFFFFF");
  const [showColourPicker, setShowColourPicker] = useState(false);
  const colorPickerRef = useRef(null);

  useClickOutside(colorPickerRef, () => {
    setShowColourPicker(false);
  });

  const handleOnSubmit = (e) => {
    // e.preventDefault();
    addFolder({ name: folderName, type: folderType, colour: customColour.hex });
  };

  console.log("Custom color: ", customColour.hex);

  return (
    <div className="fixed bottom-14 right-14">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Plus
              className="bg-white rounded-full p-3 shadow-lg shadow-black/25"
              color="black"
              size={60}
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-5">
            {folderType === "Note" ? (
              <Link to="/create-note">
                <DropdownMenuItem className="hover:bg-zinc-200 text-lg cursor-pointer">
                  <BookOpen />
                  Journal
                </DropdownMenuItem>
              </Link>
            ) : (
              <Link to={`/create-entry/${date}`}>
                <DropdownMenuItem className="hover:bg-zinc-200 text-lg cursor-pointer">
                  <BookOpen />
                  Journal
                </DropdownMenuItem>
              </Link>
            )}

            <DialogTrigger asChild>
              <DropdownMenuItem className="hover:bg-zinc-200 text-lg cursor-pointer">
                <Folder />
                Folder
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <div className="flex gap-2">
                <FaFolder color={customColour.hex} />
                New folder
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-between">
            <Label>Name</Label>
            <ColourCircles
              defaultColours={defaultPastelColours}
              setCustomColour={setCustomColour}
              setShowColourPicker={setShowColourPicker}
              showColourPicker={showColourPicker}
            />
          </div>
          <Input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleOnSubmit(e)}
          />

          {showColourPicker && (
            <div ref={colorPickerRef}>
              <ColorPicker
                hideInput={["hsv", "hex"]}
                color={customColour}
                onChange={setCustomColour}
                height={100}
                className="w-full"
              />
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button disabled={!folderName} onClick={handleOnSubmit}>
                Create
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FAB;
