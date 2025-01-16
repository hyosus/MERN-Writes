import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Circle, CirclePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import EmojiPicker from "emoji-picker-react";
import { ColorPicker } from "react-color-palette";
import "react-color-palette/css";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { createMood, deleteMood, getUser, updateMood } from "@/lib/api.js";
import queryClient from "@/lib/queryClient";
import { MOODS } from "@/hooks/useMoods";
import { hexToColor } from "@/pages/journal/CreateEntryPage";

// Custom hook for handling clicks outside
const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};

export const CustomMoodModal = ({
  isOpen,
  onOpenChange,
  customMood,
  setCustomMood,
  customEmoji,
  setCustomEmoji,
  showEmojiPicker,
  setShowEmojiPicker,
  onEmojiClick,
  defaultColours,
  showColorPicker,
  setShowColorPicker,
  customColour,
  setCustomColour,
  moodId,
  setMoodId,
}) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Refs for the picker containers
  const emojiPickerRef = useRef(null);
  const colorPickerRef = useRef(null);

  // Use the custom hook for each picker
  useClickOutside(emojiPickerRef, () => setShowEmojiPicker(false));
  useClickOutside(colorPickerRef, () => setShowColorPicker(false));

  const colourCircles = (colour) => {
    return (
      <Circle
        fill={colour}
        className="cursor-pointer"
        onClick={() => {
          setCustomColour(hexToColor(colour));
        }}
      />
    );
  };

  const onSubmit = async () => {
    const user = await getUser();
    const userId = user._id;
    if (moodId) {
      editMood({
        moodId,
        data: {
          name: customMood,
          colour: customColour.hex,
          emoji: customEmoji,
          isCustom: true,
          userId,
        },
      });
      onOpenChange(false);
    } else {
      addMood({
        name: customMood,
        colour: customColour.hex,
        emoji: customEmoji,
        isCustom: true,
        userId,
      });
      onOpenChange(false);
    }
  };

  const handleColour = (colour) => {
    // If it's a hex string (from existing mood)
    if (typeof colour === "string") {
      return colour; // Just return the hex string for background color
    }
    // If it's the color object from ColorPicker
    return colour.hex;
  };

  const { mutate: addMood } = useMutation({
    mutationFn: createMood,
    onSuccess: (data) => {
      queryClient.invalidateQueries([MOODS]);
    },
    onError: (error) => {
      console.error("Error adding mood: ", error);
    },
  });

  const { mutate: editMood } = useMutation({
    mutationFn: updateMood,
    onSuccess: () => {
      queryClient.invalidateQueries([MOODS]);
    },
  });

  const { mutate: removeMood } = useMutation({
    mutationFn: deleteMood,
    onSuccess: () => {
      queryClient.invalidateQueries([MOODS]);
      handleOpenChange(false);
      setIsDeleteOpen(false);
      console.log("Mood deleted");
    },
    onError: (error) => {
      console.error("Error deleting mood:", error);
      setIsDeleteOpen(false); // Close delete dialog even if there's an error
    },
  });

  // Reset states when the dialog is closed
  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      setCustomMood("Custom");
      setCustomEmoji(null);
      setCustomColour(hexToColor("#FFFFFF"));
      setMoodId(null);
    }
    onOpenChange(isOpen);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add your mood</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 items-center w-full">
            <div
              className="flex flex-col size-36 justify-center items-center gap-4 text-black rounded-lg"
              style={{
                backgroundColor: handleColour(customColour),
              }}
            >
              {customEmoji ? (
                <h1
                  className="text-4xl cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEmojiPicker(!showEmojiPicker);
                  }}
                >
                  {customEmoji}
                </h1>
              ) : (
                <CirclePlus
                  size={40}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEmojiPicker(!showEmojiPicker);
                  }}
                />
              )}
              <Input
                type="text"
                value={customMood}
                onChange={(e) => setCustomMood(e.target.value)}
                className="text-center w-[90%]"
              />
            </div>
            <div className="flex gap-2">
              {defaultColours.map((colour) => colourCircles(colour))}
              <CirclePlus
                onClick={(e) => {
                  e.stopPropagation();
                  setShowColorPicker(!showColorPicker);
                }}
              />
            </div>
            <div className="w-full">
              {showColorPicker && (
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
            </div>
            {showEmojiPicker && (
              <div className="w-full" ref={emojiPickerRef}>
                <EmojiPicker onEmojiClick={onEmojiClick} width="100%" />
              </div>
            )}
          </div>
          <DialogFooter>
            {moodId && (
              <Button
                variant="destructive"
                onClick={() => {
                  setIsDeleteOpen(true);
                }}
              >
                Delete
              </Button>
            )}
            <Button className="w-20" onClick={() => onSubmit()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm delete */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete mood</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this mood?</p>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => {
                if (moodId) {
                  removeMood(moodId);
                } else {
                  console.error("No mood ID provided for deletion");
                  setIsDeleteOpen(false);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
