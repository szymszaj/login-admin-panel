"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters!",
      });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) throw error;

      setMessage({
        type: "success",
        text: "Registration successful! Check your email and click the verification link.",
      });

      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setName("");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during registration";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setMessage({ type: "success", text: "Signed in successfully!" });

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Invalid email or password";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setMessage({
        type: "success",
        text: "Password reset link sent! Check your email and click the link.",
      });
      setEmail("");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while sending reset link";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl transition-all duration-300">
            {isForgotPassword
              ? "Reset Password"
              : isLogin
              ? "Sign In"
              : "Sign Up"}
          </CardTitle>
          <CardDescription className="transition-all duration-300">
            {isForgotPassword
              ? "Enter your email to receive a password reset link"
              : isLogin
              ? "Enter your credentials to sign in"
              : "Create a new account"}
          </CardDescription>
        </CardHeader>

        <form
          onSubmit={
            isForgotPassword
              ? handleForgotPassword
              : isLogin
              ? handleSignIn
              : handleSignUp
          }
          className="transition-opacity duration-500"
        >
          <CardContent className="space-y-4">
            {message && (
              <div
                className={`p-3 rounded-md text-sm transition-all duration-300 ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                    : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                }`}
              >
                {message.text}
              </div>
            )}

            {!isLogin && !isForgotPassword && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            )}

            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300 mb-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {!isForgotPassword && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            )}

            {!isLogin && !isForgotPassword && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            )}

            {isLogin && !isForgotPassword && (
              <div className="flex items-center justify-between animate-in fade-in duration-300">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Remember me
                  </Label>
                </div>
                <Button
                  variant="link"
                  className="px-0 text-sm"
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(true);
                    setMessage(null);
                  }}
                >
                  Forgot password?
                </Button>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button
              className="w-full transition-all duration-300"
              size="lg"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Loading..."
                : isForgotPassword
                ? "Send Reset Link"
                : isLogin
                ? "Sign In"
                : "Sign Up"}
            </Button>

            <div className="text-center text-sm text-muted-foreground transition-all duration-300">
              {isForgotPassword ? (
                <>
                  Remember your password?{" "}
                  <Button
                    variant="link"
                    className="px-0 font-semibold"
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setIsLogin(true);
                      setMessage(null);
                    }}
                  >
                    Sign In
                  </Button>
                </>
              ) : (
                <>
                  {isLogin
                    ? "Don't have an account? "
                    : "Already have an account? "}
                  <Button
                    variant="link"
                    className="px-0 font-semibold"
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setMessage(null);
                    }}
                  >
                    {isLogin ? "Sign Up" : "Sign In"}
                  </Button>
                </>
              )}
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
