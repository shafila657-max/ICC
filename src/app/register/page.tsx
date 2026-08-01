"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  Eye,
  EyeOff,
  UserPlus,
  GraduationCap,
  Shield,
  Users,
} from "lucide-react";
import { Button, Input, Card } from "@/components/ui";
import type { UserRole } from "@/lib/types";

const ROLES: { value: UserRole; label: string; icon: React.ElementType; description: string }[] = [
  {
    value: "student",
    label: "Student",
    icon: GraduationCap,
    description: "Enroll in courses & access learning materials",
  },
  {
    value: "alumni",
    label: "Alumni",
    icon: Users,
    description: "Connect with graduates & share updates",
  },
  {
    value: "admin",
    label: "Admin",
    icon: Shield,
    description: "Manage the center's content & users",
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student" as UserRole,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 800));

    localStorage.setItem("icc_user_role", formData.role);
    localStorage.setItem("icc_user_email", formData.email);
    localStorage.setItem("icc_user_name", formData.fullName);
    localStorage.setItem("icc_is_logged_in", "true");

    router.push(`/dashboard/${formData.role}`);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 p-4">
      <div className="absolute inset-0 star-pattern-bg pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 shadow-xl shadow-emerald-600/30 flex items-center justify-center">
              <Star className="h-7 w-7 text-gold-400 fill-gold-400" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-bold text-white">ICC</span>
              <p className="text-xs tracking-widest uppercase text-emerald-300 -mt-0.5">
                Charity Center
              </p>
            </div>
          </Link>
        </div>

        <Card className="p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-sand-900 mb-2 text-center">
            Create Account
          </h1>
          <p className="text-sand-500 text-center mb-6 text-sm">
            Join our community and make a difference
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Full Name"
              id="register-name"
              placeholder="Your full name"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
            />

            <Input
              label="Email Address"
              id="register-email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />

            <div className="relative">
              <Input
                label="Password"
                id="register-password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
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

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-sand-700">
                I am a...
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, role: role.value })
                    }
                    className={`p-3 rounded-xl border-2 transition-all text-center cursor-pointer ${
                      formData.role === role.value
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-sand-200 hover:border-sand-300"
                    }`}
                  >
                    <role.icon
                      className={`h-5 w-5 mx-auto mb-1 ${
                        formData.role === role.value
                          ? "text-emerald-600"
                          : "text-sand-400"
                      }`}
                    />
                    <span
                      className={`block text-xs font-semibold ${
                        formData.role === role.value
                          ? "text-emerald-700"
                          : "text-sand-600"
                      }`}
                    >
                      {role.label}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-sand-400 text-center">
                {ROLES.find((r) => r.value === formData.role)?.description}
              </p>
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
                  <UserPlus className="h-5 w-5" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-sand-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              Sign in
            </Link>
          </div>
        </Card>

        <p className="text-center text-emerald-300/50 text-xs mt-6">
          © {new Date().getFullYear()} Islamic Charity Center
        </p>
      </div>
    </div>
  );
}
