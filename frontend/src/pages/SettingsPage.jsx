import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import useDeleteSession from "@/hooks/useDeleteSessions";
import useSessions from "@/hooks/useSessions";
import { LoaderCircle, X } from "lucide-react";
import React from "react";

const SettingsPage = () => {
  const { sessions, isLoading, isError } = useSessions();

  const SessionCard = ({ session }) => {
    const { _id, userAgent, createdAt, isCurrent } = session;
    const { deleteSession } = useDeleteSession(_id);

    const formattedCreatedAt = new Date(createdAt).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    return (
      <Card key={_id} className="w-[98%]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {formattedCreatedAt}{" "}
            {isCurrent && <span className="text-green-500">(Current)</span>}
          </CardTitle>
          {!isCurrent && (
            <X color="red" className="cursor-pointer" onClick={deleteSession} />
          )}
        </CardHeader>
        <CardContent>
          <p className="text-zinc-400">{userAgent}</p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <h1 className="text-2xl font-bold">Your Sessions</h1>
      {isLoading && <LoaderCircle size={50} className="animate-spin" />}
      {isError && <p className="text-red-600">Failed to fetch sessions</p>}
      {sessions && (
        <ScrollArea className="h-full w-[60%]">
          {sessions.map((session) => (
            <SessionCard key={session._id} session={session} />
          ))}
        </ScrollArea>
      )}
    </div>
  );
};

export default SettingsPage;
