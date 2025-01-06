import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { register } from "@/lib/api.js";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const {
    mutate: createAccount,
    isPending,
    isError,
  } = useMutation({
    mutationFn: register,
    onSuccess: () => {
      navigate("/", {
        replace: true,
      });
    },
  });

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    value.length < 8 ? setPasswordError(true) : setPasswordError(false);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Create an account
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isError && <p className="text-red-600">An error occured</p>}
          <form>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label>Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="johnson@email.com"
                  className="border-zinc-700 focus:border-white"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label>Password</label>
                <Input
                  value={password}
                  onChange={handlePasswordChange}
                  type="password"
                  className="border-zinc-700 focus:border-white"
                />
                {passwordError && (
                  <p className="text-red-600 text-sm">
                    Must have at least 8 characters
                  </p>
                )}
                <label>Confirm Password</label>
                <Input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    createAccount({ email, password, confirmPassword })
                  }
                  type="password"
                  className="border-zinc-700 focus:border-white"
                />
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-5">
          <Button
            className="w-full"
            disabled={
              !email || password.length < 7 || password !== confirmPassword
            }
            onClick={() => createAccount({ email, password, confirmPassword })}
            isloading={isPending.toString()}
          >
            Create account
          </Button>
          <div className="text-center">
            <p>
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-sm underline underline-offset-4"
              >
                Login
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
