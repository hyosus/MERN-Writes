import FilterBar from "@/components/FilterBar";
import NotesDocument from "@/components/notes/NotesDocument";
import NotesFolder from "@/components/notes/NotesFolder";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NOTE_FOLDERS } from "@/hooks/useNoteFolders";
import { createNoteFolder } from "@/lib/api.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { File, Folder, Plus } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const NotesPage = () => {
  const [filter, setFilter] = useState("All");
  const [folderName, setFolderName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const { mutate: addFolder } = useMutation({
    mutationFn: createNoteFolder,
    onSuccess: () => {
      queryClient.invalidateQueries([NOTE_FOLDERS]);
      setIsDialogOpen(false);
    },
  });

  const handleOnSubmit = (e) => {
    // e.preventDefault();
    addFolder({ name: folderName, type: "Note" });
  };

  return (
    <>
      <FilterBar filter={filter} onFilterChange={handleFilterChange} />

      <div className="flex flex-col flex-grow h-full overflow-hidden">
        {/* <NotesDocument filter={filter} /> */}
        {filter === "All" || filter === "Folder" ? (
          <NotesFolder filter={filter} />
        ) : null}
        {filter === "All" || filter === "Document" ? (
          <NotesDocument filter={filter} />
        ) : null}
      </div>
      <div className="fixed bottom-14 right-14">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
              <Plus
                className="bg-white rounded-full p-3 shadow-lg shadow-black/25"
                color="black"
                size={60}
              />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-5">
              <Link to="/create-note">
                <DropdownMenuItem className="hover:bg-zinc-200 text-lg cursor-pointer">
                  <File />
                  Note
                </DropdownMenuItem>
              </Link>

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
              <DialogTitle>New folder</DialogTitle>
            </DialogHeader>
            <Label>Name</Label>
            <Input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleOnSubmit(e)}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button disabled={!folderName} onClick={handleOnSubmit}>
                  Create
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <p>Trigger</p>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DialogTrigger>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                Deleting this entry cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}
      </div>
    </>
  );
};

export default NotesPage;
