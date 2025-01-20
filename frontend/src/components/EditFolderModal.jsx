import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { FaFolder } from "react-icons/fa6";
import ColourCircles from "./ColourCircles";
import { ColorPicker } from "react-color-palette";

export const EditFolderModal = ({
  defaultColours,
  isDialogOpen,
  setIsDialogOpen,
  setCustomColour,
  customColour,
  showColourPicker,
  setShowColourPicker,
  colorPickerRef,
  handleSave,
}) => {
  console.log("COLOUR", customColour);
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <h2>Edit folder</h2>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <FaFolder size={60} color={customColour.hex} />
          <ColourCircles
            defaultColours={defaultColours}
            setCustomColour={setCustomColour}
            setShowColourPicker={setShowColourPicker}
            showColourPicker={showColourPicker}
          />
        </div>
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
          <Button
            onClick={() => {
              handleSave();
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditFolderModal;
