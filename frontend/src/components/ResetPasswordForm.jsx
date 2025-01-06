import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { BadgeCheck } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const ResetPasswordForm = ({ verificationCode }) => {
  console.log("CB verificationCode: ", verificationCode);
  const [password, setPassword] = useState("");

  const {
    mutate: resetUserPassword,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: resetPassword,
  });

  const handleOnSubmit = (e) => {
    e.preventDefault();
    resetUserPassword({ verificationCode, password });
  };

  const renderSuccessAlert = () => (
    <Alert className="w-full bg-green-300/15 border-green-300">
      <BadgeCheck color="#86efac" />
      <AlertTitle className="text-xl">Success!</AlertTitle>
      <AlertDescription>Password has been reset</AlertDescription>
    </Alert>
  );

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Reset your password
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isSuccess ? (
          renderSuccessAlert()
        ) : (
          <form>
            {isError && <p className="text-red-600">An error occured</p>}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label>New Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleOnSubmit(e)}
                  className="border-zinc-700 focus:border-white"
                />
              </div>
              <Button
                className="w-full"
                disabled={!password}
                isloading={isPending.toString()}
                onClick={handleOnSubmit}
              >
                Reset Password
              </Button>
            </div>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-5">
        <p className="text-center text-sm">
          Go back to{" "}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default ResetPasswordForm;
