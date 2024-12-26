import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { resendVerificationEmail, verifyEmail } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BadgeCheck, CircleX, LoaderCircle, MoveLeft } from "lucide-react";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";

const VerifyEmailPage = () => {
  const { code } = useParams();
  const [resent, setResent] = useState(false);
  const { isPending, isError, isSuccess } = useQuery({
    queryKey: ["emailVerification", code],
    queryFn: () => verifyEmail(code),
    refetchOnWindowFocus: false,
  });

  const { mutate: resendEmail } = useMutation({
    mutationFn: resendVerificationEmail,
    onSuccess: () => {
      setResent(true);
    },
  });

  const handleResendClick = (e) => {
    e.preventDefault();
    resendEmail();
  };

  const renderSuccessAlert = () => (
    <Alert className="w-fit bg-green-300/15 border-green-300">
      <BadgeCheck color="#86efac" />
      <AlertTitle className="text-xl">Success!</AlertTitle>
      <AlertDescription>Your email has been verified!</AlertDescription>
    </Alert>
  );

  const renderErrorAlert = () => (
    <Alert className="w-fit bg-red-300/15 border-red-300">
      <CircleX color="#fca5a5" />
      <AlertTitle className="text-xl">Error</AlertTitle>
      <AlertDescription>
        The link is either invalid or expired.{" "}
        <Link
          to="/resend-verification-email/"
          onClick={handleResendClick}
          className="text-blue-500"
        >
          Get a new link
        </Link>
      </AlertDescription>
    </Alert>
  );

  const renderResentAlert = () => (
    <Alert className="w-fit bg-green-300/15 border-green-300">
      <BadgeCheck color="#86efac" />
      <AlertTitle className="text-xl">Success!</AlertTitle>
      <AlertDescription>
        A new verification link has been sent to your email.
      </AlertDescription>
    </Alert>
  );

  return (
    <div className="flex flex-col gap-6 items-center justify-center w-full h-screen">
      {isPending ? (
        <LoaderCircle size={50} className="animate-spin" />
      ) : resent ? (
        renderResentAlert()
      ) : isSuccess ? (
        renderSuccessAlert()
      ) : isError ? (
        renderErrorAlert()
      ) : null}

      <Link to="/" className="flex gap-2 underline underline-offset-4">
        <MoveLeft />
        Back to home
      </Link>
    </div>
  );
};

export default VerifyEmailPage;
