import ResetPasswordForm from "@/components/ResetPasswordForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleX } from "lucide-react";
import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const exp = Number(searchParams.get("exp"));
  const now = Date.now();
  const linkIsValid = code && exp && exp > now;

  const renderErrorAlert = () => (
    <Alert className="w-fit bg-red-300/15 border-red-300">
      <CircleX color="#fca5a5" />
      <AlertTitle className="text-xl">Error</AlertTitle>
      <AlertDescription>
        The link is either invalid or expired.{" "}
        <Link to="/forgot-password" className="text-blue-500">
          Get a new link
        </Link>
      </AlertDescription>
    </Alert>
  );

  return (
    <div className="flex justify-center items-center h-screen">
      {linkIsValid ? (
        <ResetPasswordForm verificationCode={code} />
      ) : (
        renderErrorAlert()
      )}
    </div>
  );
};

export default ResetPasswordPage;
