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
import { sendResetPasswordEmail } from "@/lib/api.js";
import { useMutation } from "@tanstack/react-query";
import { CircleCheck } from "lucide-react";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const {
    mutate: sendEmail,
    isPending,
    isError,
    isSuccess,
  } = useMutation({
    mutationFn: sendResetPasswordEmail,
  });

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    sendEmail(email);
  };

  console.log(isSuccess);

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Reset your password
          </CardTitle>
        </CardHeader>

        {isSuccess ? (
          <div className="flex justify-center items-center w-full pb-4">
            <Alert className="w-[300px] bg-green-300/15 border-green-300">
              <CircleCheck color="#86efac" />

              <AlertTitle className="text-xl">Email sent!</AlertTitle>
              <AlertDescription>
                Email to reset your password has been sent, please check your
                inbox
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <CardContent>
            {isError && <p className="text-red-600">Invalid email</p>}
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label>Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendEmail(email)}
                    placeholder="johnson@email.com"
                    className="border-zinc-700 focus:border-white"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={!email}
                  isloading={isPending.toString()}
                >
                  Reset Password
                </Button>
              </div>
            </form>
          </CardContent>
        )}

        <CardFooter className="flex flex-col gap-5">
          <p className="text-center text-sm">
            Go back to{" "}
            <Link to="/login" className="text-blue-500">
              Login
            </Link>{" "}
            or{" "}
            <Link to="/register" className="text-blue-500">
              Create Account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
