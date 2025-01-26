import JournalsRTE from "@/components/tiptap/JournalsRTE";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { JOURNALS } from "@/hooks/useJournal";
import useMoods, { MOODS } from "@/hooks/useMoods";
import { getEntry, updateEntry } from "@/lib/api.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Ellipsis, PencilIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./createEntry.css";
import queryClient from "@/lib/queryClient";
import { CustomMoodModal } from "@/components/journal/CustomMoodModal";
import { useColor } from "react-color-palette";
import { hexToColor } from "./CreateEntryPage";
import DeleteEntryModal from "@/components/journal/DeleteEntryModal";
import useDeleteEntry from "@/hooks/useDeleteEntry";
import useJournalById from "@/hooks/useJournalById";

const EditEntryPage = () => {
  const { journalId } = useParams();
  const [date, setDate] = useState(null);
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { moods } = useMoods();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customMood, setCustomMood] = useState("Custom");
  const [customEmoji, setCustomEmoji] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColourPicker, setShowColourPicker] = useState(false);
  const [customColour, setCustomColour] = useColor("#FFFFFF");
  const [moodId, setMoodId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { deleteEntry } = useDeleteEntry();
  const { journal, isLoading, isError } = useJournalById(journalId);

  useEffect(() => {
    if (journal) {
      console.log("Journal data: ", journal);
      console.log("TITLE: ", journal.title);
      setDate(new Date(journal.date) || new Date());
      setTitle(journal.title || " ");
      setContent(journal.content || " ");
      setSelectedMoods(journal.mood || []);
    }
  }, [journal]);

  const { mutate: editEntry } = useMutation({
    mutationFn: updateEntry,
    onSuccess: () => {
      console.log("Entry updated");
    },
    onError: (error) => {
      console.error("Error updating entry: ", error);
    },
  });

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

  const handleMoodSelected = (moodId) => {
    const dateToUse = new Date(date);
    console.log("1. Original date:", dateToUse);
    console.log("2. Original date ISO:", dateToUse.toISOString());

    const formattedDate = formatDate(dateToUse);
    console.log("3. Formatted date being sent to API:", formattedDate);

    if (selectedMoods.includes(moodId)) {
      // remove from selectedMoods
      setSelectedMoods((prev) => prev.filter((id) => id !== moodId));
      editEntry({
        journalId,
        data: {
          mood: selectedMoods.filter((id) => id !== moodId),
          date: formattedDate, // Send YYYY-MM-DD string
        },
      });
    } else {
      // add to selectedMoods
      setSelectedMoods((prev) => [...prev, moodId]);

      editEntry({
        journalId,
        data: {
          mood: [...selectedMoods, moodId],
          date: formattedDate,
        },
      });
    }
  };

  const onEmojiClick = (emojiObject) => {
    setCustomEmoji(emojiObject.emoji);
    setShowEmojiPicker(false);
    console.log("Emoji clicked: ", emojiObject.emoji);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleTitleChange = (e) => {
    const dateToUse = new Date(date);
    const formattedDate = formatDate(dateToUse);

    const newTitle = e.target.value;
    setTitle(newTitle);

    editEntry({
      journalId,
      data: { title: newTitle, date: formattedDate },
    });
  };

  const handleDateChange = (newDate) => {
    if (!newDate) return;

    const formattedDate = formatDate(newDate);

    editEntry({
      journalId,
      data: { date: formattedDate },
    });

    setDate(newDate);
  };

  const handleDelete = () => {
    if (journalId) {
      deleteEntry(journalId);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error...</p>;

  return (
    <>
      <CustomMoodModal
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
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
        moodId={moodId}
        setMoodId={setMoodId}
      />

      <div className="flex justify-between items-center pb-3">
        <div className="flex gap-3 items-center">
          <h1>{date && format(date, "PPP")}</h1>
          {/* Datepicker */}
          <Popover>
            <PopoverTrigger asChild>
              <CalendarIcon className="mr-2 h-4 w-4 cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={new Date(date)}
                onSelect={(newDate) => {
                  handleDateChange(newDate);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="icon">
              <Ellipsis />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit">
            <Button
              variant="destructive"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete
            </Button>
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
        date={formatDate(new Date(date))}
        journalId={journalId}
        setJournalId={() => {}} // Not needed for edit mode
        initialContent={content}
      />

      <DeleteEntryModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        selectedEntryId={journalId}
        handleDelete={handleDelete}
      />
    </>
  );
};

export default EditEntryPage;
