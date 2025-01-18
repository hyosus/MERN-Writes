import React, { useEffect, useRef, useState } from "react";
import { format, set } from "date-fns";
import { useParams } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, CirclePlus, PencilIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import useMoods, { MOODS } from "@/hooks/useMoods";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import JournalsRTE from "@/components/tiptap/JournalsRTE";
import { createEntry, updateEntry } from "@/lib/api.js";
import { useMutation } from "@tanstack/react-query";
import "./createEntry.css";
import queryClient from "@/lib/queryClient";
import { CustomMoodModal } from "@/components/journal/CustomMoodModal";
import { useColor } from "react-color-palette";

// Helper func to convert hex to RGB and HSV in order for colour picker to work when editing a mood
export const hexToColor = (hex) => {
  // Remove the hash if it exists
  hex = hex.replace("#", "");

  // Convert hex to rgb
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Return the color object
  return {
    hex: `#${hex}`,
    rgb: { r, g, b, a: 1 },
    hsv: { h: 0, s: 0, v: (Math.max(r, g, b) / 255) * 100, a: 1 },
  };
};

const CreateEntryPage = () => {
  const { date } = useParams();
  const [customDate, setCustomDate] = useState(null);
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [entryId, setEntryId] = useState(null); // Track the created entry ID
  const [title, setTitle] = useState("");
  const [showColourPicker, setShowColourPicker] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [customMood, setCustomMood] = useState("Custom");
  const [customEmoji, setCustomEmoji] = useState(null);
  const [customColour, setCustomColour] = useState("#FFFFFF");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [moodId, setMoodId] = useState(null);
  const [content, setContent] = useState("");

  const { moods, isLoading, isError } = useMoods();

  const { mutate: addEntry } = useMutation({
    mutationFn: createEntry,
    onSuccess: (data) => {
      console.log("Entry created with ID: ", data._id);
      setEntryId(data._id); // Set the created note ID
      queryClient.invalidateQueries([MOODS]);
    },
  });

  const { mutate: editEntry } = useMutation({
    mutationFn: updateEntry,
    onSuccess: (data) => {
      console.log("Entry updated: ", data);
      queryClient.invalidateQueries([MOODS]);
    },
    onError: (error) => {
      console.error("Error updating entry: ", error);
    },
  });

  // Create a date string in YYYY-MM-DD format based on local timezone
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleMoodSelected = (moodId) => {
    const dateToUse = customDate ? customDate : new Date(date);
    console.log("1. Original date:", dateToUse);
    console.log("2. Original date ISO:", dateToUse.toISOString());

    const formattedDate = formatDate(dateToUse);
    console.log("3. Formatted date being sent to API:", formattedDate);

    if (selectedMoods.includes(moodId)) {
      // remove from selectedMoods
      setSelectedMoods((prev) => prev.filter((id) => id !== moodId));
      if (entryId) {
        editEntry({
          entryId,
          data: {
            mood: selectedMoods.filter((id) => id !== moodId),
            date: formattedDate, // Send YYYY-MM-DD string
          },
        });
      } else {
        addEntry({
          mood: selectedMoods.filter((id) => id !== moodId),
          date: formattedDate,
        });
      }
    } else {
      // add to selectedMoods
      setSelectedMoods((prev) => [...prev, moodId]);

      if (entryId) {
        editEntry({
          entryId,
          data: {
            mood: [...selectedMoods, moodId],
            date: formattedDate,
          },
        });
      } else {
        addEntry({
          mood: [...selectedMoods, moodId],
          date: formattedDate,
        });
      }
    }
  };

  const handleTitleChange = (e) => {
    const dateToUse = customDate ? customDate : new Date(date);
    const formattedDate = formatDate(dateToUse);

    const newTitle = e.target.value;
    setTitle(newTitle);

    if (entryId) {
      editEntry({
        entryId,
        data: { title: newTitle, date: formattedDate },
      });
    } else {
      addEntry({
        title: newTitle,
        date: formattedDate,
      });
    }
  };

  const onEmojiClick = (emojiObject) => {
    setCustomEmoji(emojiObject.emoji);
    setShowEmojiPicker(false);
    console.log("Emoji clicked: ", emojiObject.emoji);
  };

  const moodBlock = (mood) => {
    const isSelected = selectedMoods.includes(mood._id);
    const { userId } = mood;
    return (
      <div className="relative h-full pt-4">
        {userId && (
          <div className="absolute top-0 right-0 transform  translate-x-[20%]">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                setCustomMood(mood.name);
                setCustomEmoji(mood.emoji);
                // Convert hex to the expected color object format
                setCustomColour(hexToColor(mood.colour));
                setIsDialogOpen(true);
                setMoodId(mood._id);
              }}
            >
              <PencilIcon />
            </Button>
          </div>
        )}

        <Button
          key={mood._id}
          id="mood-btn"
          className="flex flex-col size-20"
          style={{
            backgroundColor: mood.colour,
            opacity: isSelected && "60%",
          }}
          onClick={() => handleMoodSelected(mood._id)}
        >
          <h1>{mood.emoji}</h1>
          {mood.name}
        </Button>
      </div>
    );
  };

  return (
    <>
      <div className="flex gap-3 items-center pb-2">
        <h1>{customDate ? format(customDate, "PPP") : format(date, "PPP")}</h1>
        {/* Datepicker */}
        <Popover>
          <PopoverTrigger asChild>
            <CalendarIcon className="mr-2 h-4 w-4 cursor-pointer" />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={customDate ? customDate : new Date(date)}
              onSelect={setCustomDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col gap-2 pb-2">
        <p>Today I feel...</p>
        <div className="flex items-end gap-3 pb-2 translate-y-[-10%]">
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="flex flex-col size-20 text-white bg-transparent border-dashed border-2 border-white hover:text-black"
          >
            <h1>➕</h1>
            Custom
          </Button>
          <ScrollArea className="flex flex-col overflow-auto ">
            <div className="flex gap-3">
              {moods && moods.map((mood) => moodBlock(mood))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>

      <CustomMoodModal
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        setMoodId={setMoodId}
        moodId={moodId}
        customMood={customMood}
        setCustomMood={setCustomMood}
        customEmoji={customEmoji}
        setCustomEmoji={setCustomEmoji}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        onEmojiClick={onEmojiClick}
        showColourPicker={showColourPicker}
        setShowColourPicker={setShowColourPicker}
        customColour={customColour}
        setCustomColour={setCustomColour}
      />

      {/* Journal editor */}
      <div className="pb-5">
        <Label>Title</Label>
        <Input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="border-white/30"
        />
      </div>
      <JournalsRTE
        date={customDate ? formatDate(customDate) : formatDate(new Date(date))}
        entryId={entryId}
        setEntryId={setEntryId}
        content={content}
        setContent={setContent}
      />
    </>
  );
};

export default CreateEntryPage;
