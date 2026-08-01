"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Moon, Eye, EyeOff, LogIn, ArrowRight } from "lucide-react";
import { Button, Input, Card } from "@/components/ui";
import type { UserRole } from "@/lib/types";

const DEMO_ACCOUNTS: { role: UserRole; email: string; label: string }[] = [
  { role: "admin", email: "admin@icc.org", label: "Admin" },
  { role: "student", email: "student@icc.org", label: "Student" },
  { role: "alumni", email: "alumni@icc.org", label: "Alumni" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent, role?: UserRole) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate auth delay
    await new Promise((r) => setTimeout(r, 800));

    const loginRole = role || "student";
    
    // Store role in localStorage for demo
    localStorage.setItem("icc_user_role", loginRole);
    localStorage.setItem("icc_user_email", role ? `${role}@icc.org` : email);
    localStorage.setItem("icc_user_name", role ? `${role.charAt(0).toUpperCase() + role.slice(1)} User` : "User");
    localStorage.setItem("icc_is_logged_in", "true");

    router.push(`/dashboard/${loginRole}`);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 p-4">
      <div className="absolute inset-0 star-pattern-bg pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="p-2 rounded-2xl bg-white/90 shadow-xl flex items-center justify-center">
              <img src="/logo.png" alt="ICC Logo" className="h-12 w-auto object-contain" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-bold text-white">ICC</span>
              <p className="text-xs tracking-widest uppercase text-emerald-300 -mt-0.5">
                Islamic Charity Center
              </p>
            </div>
          </Link>
        </div>

        <Card className="p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-sand-900 mb-2 text-center">
            Welcome Back
          </h1>
          <p className="text-sand-500 text-center mb-6 text-sm">
            Sign in to access your dashboard
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email Address"
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-sand-400 hover:text-sand-600 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-sand-600 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-sand-300 text-emerald-600 focus:ring-emerald-500"
                />
                Remember me
              </label>
              <a
                href="#"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-sand-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              Register here
            </Link>
          </div>

          {/* Demo Quick Login */}
          <div className="mt-8 pt-6 border-t border-sand-200">
            <p className="text-xs text-sand-400 text-center mb-3 uppercase tracking-wider font-medium">
              Quick Demo Login
            </p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.role}
                  onClick={(e) => handleLogin(e, account.role)}
                  className="p-3 rounded-xl border border-sand-200 text-center hover:border-emerald-400 hover:bg-emerald-50 transition-all cursor-pointer group"
                >
                  <span className="block text-sm font-semibold text-sand-700 group-hover:text-emerald-700">
                    {account.label}
                  </span>
                  <span className="block text-[10px] text-sand-400 mt-0.5">
                    {account.email}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </Card>

        <p className="text-center text-emerald-300/50 text-xs mt-6">
          © {new Date().getFullYear()} Islamic Charity Center
        </p>
      </div>
    </div>
  );
}
