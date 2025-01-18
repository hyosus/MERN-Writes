import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";

const FoldersModal = ({
  folders,
  isDialogOpen,
  setIsDialogOpen,
  handleCheckboxChange,
  selectedFolders,
  onFoldersModalSubmit,
}) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <h2>Folders</h2>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          {folders?.map((folder) => (
            <>
              <div className="flex gap-2 items-center">
                <Checkbox
                  id={folder._id}
                  checked={selectedFolders[folder._id] || false}
                  onCheckedChange={() => handleCheckboxChange(folder._id)}
                />
                <label className="flex items-center gap-1" htmlFor={folder._id}>
                  <div
                    className="size-[12px] rounded-[3px]"
                    style={{ backgroundColor: folder.colour }}
                  />
                  <p key={folder._id}>{folder.name}</p>
                </label>
              </div>
            </>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onFoldersModalSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FoldersModal;
