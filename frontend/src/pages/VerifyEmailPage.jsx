import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { verifyEmail } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, CircleX, LoaderCircle, MoveLeft } from "lucide-react";
import React from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";

const VerifyEmailPage = () => {
  const { code } = useParams();
  const { isPending, isError, isSuccess } = useQuery({
    queryKey: ["emailVerification", code],
    queryFn: () => verifyEmail(code),
  });

  const check = () => {
    if (!isError) {
      console.log("success");
      return (
        <Alert className="w-fit bg-green-300/15 border-green-300">
          <BadgeCheck color="#86efac" />

          <AlertTitle className="text-xl">Success!</AlertTitle>
          <AlertDescription>Your email has been verified!</AlertDescription>
        </Alert>
      );
    } else {
      console.log("error");
      return (
        <Alert className="w-fit bg-red-300/15 border-red-300">
          <CircleX color="#fca5a5" />

          <AlertTitle className="text-xl">Error</AlertTitle>
          <AlertDescription>
            The link is either invalid or expired. {""}
            <Link to="/" className="text-blue-500">
              Get a new link
            </Link>
          </AlertDescription>
        </Alert>
      );
    }
  };

  return (
    <div className="flex flex-col gap-6 items-center justify-center w-full h-screen">
      {isPending ? (
        <LoaderCircle size={50} className="animate-spin" />
      ) : (
        check()
      )}
      <Link to="/" className="flex gap-2 underline underline-offset-4">
        <MoveLeft />
        Back to home
      </Link>
    </div>
  );
};

export default VerifyEmailPage;
