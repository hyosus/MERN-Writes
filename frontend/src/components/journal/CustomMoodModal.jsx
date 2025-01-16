import {
  Dialog,
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
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { createMood, getUser } from "@/lib/api.js";
import queryClient from "@/lib/queryClient";
import { MOODS } from "@/hooks/useMoods";

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
  showEmojiPicker,
  setShowEmojiPicker,
  onEmojiClick,
  defaultColours,
  showColorPicker,
  setShowColorPicker,
  customColour,
  setCustomColour,
}) => {
  // Refs for the picker containers
  const emojiPickerRef = useRef(null);
  const colorPickerRef = useRef(null);

  // Use the custom hook for each picker
  useClickOutside(emojiPickerRef, () => setShowEmojiPicker(false));
  useClickOutside(colorPickerRef, () => setShowColorPicker(false));

  const colourCircles = (colour) => {
    return <Circle fill={colour} />;
  };

  const onSubmit = async () => {
    const user = await getUser();
    const userId = user._id;
    addMood({
      name: customMood,
      colour: getHslString(customColour.hsv),
      emoji: customEmoji,
      isCustom: true,
      userId,
    });
  };

  // HSV string formatter
  const getHslString = (hsv) => {
    return `hsl(${hsv.h} ${Math.round(hsv.s)}% ${Math.round(
      hsv.v
    )}% / ${hsv.a.toFixed(2)})`;
  };

  const { mutate: addMood } = useMutation({
    mutationFn: createMood,
    onSuccess: () => {
      queryClient.invalidateQueries([MOODS]);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add your mood</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 items-center w-full">
          <div
            className="flex flex-col size-36 justify-center items-center gap-4 text-black rounded-lg"
            style={{
              backgroundColor: getHslString(customColour.hsv),
            }}
          >
            {customEmoji ? (
              <h1 className="text-4xl">{customEmoji}</h1>
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
                  hideInput={["rgb", "hex"]}
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
          <Button className="w-20" onClick={() => onSubmit()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
