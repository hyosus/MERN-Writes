import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/api.js";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
const redirectUrl = location.state?.redirectUrl || "/";

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    mutate: signIn,
    isPending,
    isError,
  } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate(redirectUrl, {
        replace: true,
      });
    },
  });

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
        </CardHeader>

        <CardContent>
          {isError && <p className="text-red-600">Invalid email or password</p>}
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
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && signIn({ email, password })
                  }
                  type="password"
                  className="border-zinc-700 focus:border-white"
                />
                <Link
                  to="/forgot-password"
                  className="text-sm text-right hover:underline underline-offset-4"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-5">
          <Button
            className="w-full"
            disabled={!email || password.length < 7}
            onClick={() => signIn({ email, password })}
            isloading={isPending.toString()}
          >
            Login
          </Button>
          <div className="text-center">
            <p>
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-sm underline underline-offset-4"
              >
                Sign up
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
