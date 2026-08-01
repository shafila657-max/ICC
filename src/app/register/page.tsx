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
  Clock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button, Input, Card, Badge } from "@/components/ui";
import { createUserProfile } from "@/lib/supabase/api";
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
    description: "Requires Admin approval before dashboard access",
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
  const [isPendingApproval, setIsPendingApproval] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Save profile to Supabase database
    const profileRes = await createUserProfile({
      full_name: formData.fullName,
      email: formData.email,
      role: formData.role,
    });

    setIsLoading(false);

    if (formData.role === "alumni") {
      // Alumni require Admin approval
      setIsPendingApproval(true);
      localStorage.setItem("icc_user_role", "alumni");
      localStorage.setItem("icc_user_email", formData.email);
      localStorage.setItem("icc_user_name", formData.fullName);
      localStorage.setItem("icc_is_logged_in", "false");
    } else {
      localStorage.setItem("icc_user_role", formData.role);
      localStorage.setItem("icc_user_email", formData.email);
      localStorage.setItem("icc_user_name", formData.fullName);
      localStorage.setItem("icc_is_logged_in", "true");
      router.push(`/dashboard/${formData.role}`);
    }
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

        {isPendingApproval ? (
          /* Alumni Pending Approval Card */
          <Card className="p-8 shadow-2xl text-center space-y-6">
            <div className="h-16 w-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto text-gold-600">
              <Clock className="h-8 w-8 animate-pulse" />
            </div>

            <div>
              <Badge variant="gold" className="mb-2 uppercase tracking-wider text-xs">
                Registration Submitted
              </Badge>
              <h2 className="text-2xl font-extrabold text-sand-900">
                Pending Admin Approval
              </h2>
              <p className="text-sand-600 text-sm mt-3 leading-relaxed">
                Thank you for registering for the <strong>ASMAR Alumni Network</strong>, {formData.fullName.split(" ")[0]}!
              </p>
              <p className="text-sand-500 text-xs mt-2 bg-sand-50 p-4 rounded-xl border border-sand-200">
                🔒 Alumni accounts require Administrator verification before onboarding. Once an Admin reviews and approves your details, your account will be activated for full portal access.
              </p>
            </div>

            <div className="pt-4 border-t border-sand-100 space-y-2">
              <Link href="/">
                <Button className="w-full font-bold">
                  Return to Home Page <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="w-full text-xs">
                  Go to Login Screen
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          /* Registration Form */
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
        )}

        <p className="text-center text-emerald-300/50 text-xs mt-6">
          © {new Date().getFullYear()} Islamic Charity Center
        </p>
      </div>
    </div>
  );
}
