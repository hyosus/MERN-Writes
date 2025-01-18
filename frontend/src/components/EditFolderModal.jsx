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

export const EditFolderModal = ({ isDialogOpen, setIsDialogOpen }) => {
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
          <FaFolder size={60} />
          <ColourCircles />
        </div>
        <DialogFooter>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditFolderModal;
