"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isMagicLink, setIsMagicLink] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", isError: false });

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: "", isError: false });
    setIsLoading(true);

    if (!email) {
      setMessage({ text: "Email address is required.", isError: true });
      setIsLoading(false);
      return;
    }

    try {
      if (isMagicLink) {
        // Send Supabase Magic Link
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/api/auth/callback`,
          },
        });

        if (error) throw error;

        // Track magic link login
        if (typeof window !== "undefined" && window.pendo) {
          window.pendo.track("user_logged_in", {
            authMethod: "magic_link",
          });
        }

        setMessage({
          text: "Check your email for a secure passwordless login link!",
          isError: false,
        });
      } else {
        // Traditional Password Sign In
        if (!password) {
          setMessage({ text: "Password is required.", isError: true });
          setIsLoading(false);
          return;
        }

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Track password login
        if (typeof window !== "undefined" && window.pendo) {
          window.pendo.track("user_logged_in", {
            authMethod: "password",
          });
        }

        // Redirect to dashboard
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setMessage({
        text: err.message || "Authentication failed. Please verify credentials.",
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        {/* Backlos Logo Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center space-x-2">
            <span className="flex items-center justify-center w-10 h-10 bg-brand-primary text-white font-bold rounded-full text-xl shadow-md">
              ↺
            </span>
            <span className="text-3xl font-bold tracking-tight text-brand-text">
              Backlos
            </span>
          </div>
          <p className="text-sm text-brand-muted mt-2 font-medium">
            Every applicant deserves closure.
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-8 border-1.5 border-brand-border shadow-premium">
          <CardContent className="p-0">
            <h2 className="text-2xl font-bold text-brand-text mb-6">
              {isMagicLink ? "Sign in with Magic Link" : "Sign in to Backlos"}
            </h2>

            {message.text && (
              <div
                className={`mb-4 p-3 border text-xs font-semibold rounded-btn ${
                  message.isError
                    ? "bg-red-50 border-red-200 text-red-700"
                    : "bg-emerald-50 border-emerald-200 text-emerald-700"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-4">
              <Input
                label="Work Email"
                placeholder="jane@company.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />

              {!isMagicLink && (
                <Input
                  label="Password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-4"
                isLoading={isLoading}
              >
                {isMagicLink ? "Send login link" : "Sign in"}
              </Button>
            </form>

            {/* Toggle Magic Link & traditional login */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsMagicLink(!isMagicLink);
                  setMessage({ text: "", isError: false });
                }}
                className="text-xs font-semibold text-brand-primary hover:underline"
              >
                {isMagicLink
                  ? "Use password sign-in instead"
                  : "Send me a passwordless magic link instead"}
              </button>
            </div>

            <div className="mt-6 text-center text-sm text-brand-muted border-t border-brand-light pt-6">
              New to Backlos?{" "}
              <Link
                href="/signup"
                className="font-semibold text-brand-primary hover:underline"
              >
                Create an account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
