import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import useAuth from "@/hooks/useAuth";
import React from "react";
import { HiCheckBadge } from "react-icons/hi2";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { user } = useAuth();
  const { email, verified, createdAt } = user;
  const formattedCreatedAt = new Date(createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return (
    <div className="flex flex-col items-center justify-start w-full h-full bg-zinc-900 rounded-xl pt-10">
      <img
        className="size-[150px] object-cover rounded-full z-10"
        src="https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcQUiy0LPv_XJ7nd9acNkbZCFXZXOIGA0Wd3Dko37LFhrDPBEMrGVoRjT0rKJO2vq8TNDOr4irj4uSIVc8s"
      />
      <Card className="flex flex-col gap-2 items-center justify-center w-full min-h-40 max-w-md p-8 pt-8 mt-[-50px] border-white/50">
        {!verified && (
          <Alert className="w-fit bg-red-300/15 border-red-300 mt-8">
            <AlertDescription>
              Please{" "}
              <Link to="/resend-verification-email" className="text-blue-500">
                {" "}
                verify
              </Link>{" "}
              your email{" "}
            </AlertDescription>
          </Alert>
        )}
        <div className="flex gap-2 items-center">
          <p>{email}</p>
          {verified && <HiCheckBadge color="green" size={20} />}
        </div>
        <p>Created on: {formattedCreatedAt}</p>
      </Card>
    </div>
  );
};

export default ProfilePage;
