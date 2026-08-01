"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Star,
  Home,
  Users,
  Megaphone,
  Calendar,
  Image as ImageIcon,
  DollarSign,
  BookOpen,
  Bell,
  User,
  Network,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, Badge } from "@/components/ui";
import type { UserRole } from "@/lib/types";

const ROLE_NAV: Record<
  UserRole,
  { label: string; href: string; icon: React.ElementType; tab: string }[]
> = {
  admin: [
    { label: "Overview", href: "/dashboard/admin?tab=overview", icon: Home, tab: "overview" },
    { label: "Users", href: "/dashboard/admin?tab=users", icon: Users, tab: "users" },
    { label: "Announcements", href: "/dashboard/admin?tab=announcements", icon: Megaphone, tab: "announcements" },
    { label: "Events", href: "/dashboard/admin?tab=events", icon: Calendar, tab: "events" },
    { label: "Gallery", href: "/dashboard/admin?tab=gallery", icon: ImageIcon, tab: "gallery" },
    { label: "Donations", href: "/dashboard/admin?tab=donations", icon: DollarSign, tab: "donations" },
  ],
  student: [
    { label: "Overview", href: "/dashboard/student", icon: Home, tab: "overview" },
    { label: "My Courses", href: "/dashboard/student#courses", icon: BookOpen, tab: "courses" },
    { label: "Announcements", href: "/dashboard/student#announcements", icon: Bell, tab: "announcements" },
    { label: "Profile", href: "/dashboard/student#profile", icon: User, tab: "profile" },
  ],
  alumni: [
    { label: "Overview", href: "/dashboard/alumni", icon: Home, tab: "overview" },
    { label: "Directory", href: "/dashboard/alumni#directory", icon: Network, tab: "directory" },
    { label: "Community", href: "/dashboard/alumni#community", icon: MessageSquare, tab: "community" },
    { label: "Profile", href: "/dashboard/alumni#profile", icon: User, tab: "profile" },
  ],
};

const ROLE_COLORS: Record<UserRole, string> = {
  admin: "bg-red-100 text-red-700",
  student: "bg-blue-100 text-blue-700",
  alumni: "bg-purple-100 text-purple-700",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("student");
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("user@icc.org");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const role = (localStorage.getItem("icc_user_role") || "student") as UserRole;
    const name = localStorage.getItem("icc_user_name") || "User";
    const email = localStorage.getItem("icc_user_email") || "user@icc.org";
    setUserRole(role);
    setUserName(name);
    setUserEmail(email);

    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const tab = urlParams.get("tab") || "overview";
      setActiveTab(tab);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("icc_user_role");
    localStorage.removeItem("icc_user_email");
    localStorage.removeItem("icc_user_name");
    localStorage.removeItem("icc_is_logged_in");
    router.push("/");
  };

  const navItems = ROLE_NAV[userRole] || ROLE_NAV.student;

  return (
    <div className="min-h-screen bg-sand-50 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-sand-200 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-sand-100">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center shadow-md">
              <Star className="h-5 w-5 text-gold-400 fill-gold-400" />
            </div>
            <div>
              <span className="text-lg font-bold text-sand-900">ICC</span>
              <p className="text-[10px] tracking-widest uppercase text-sand-400 -mt-0.5">
                Dashboard
              </p>
            </div>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              userRole === "admin"
                ? activeTab === item.tab
                : pathname === item.href || (item.href.includes("#") && pathname === item.href.split("#")[0]);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => {
                  setSidebarOpen(false);
                  setActiveTab(item.tab);
                }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-emerald-50 text-emerald-700 shadow-sm font-bold"
                    : "text-sand-600 hover:bg-sand-50 hover:text-sand-900"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-emerald-600" : "text-sand-400")} />
                {item.label}
                {isActive && <ChevronRight className="h-4 w-4 ml-auto text-emerald-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-sand-100">
          <div className="flex items-center gap-3 mb-4 px-2">
            <Avatar name={userName} size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-sand-900 truncate">
                {userName}
              </p>
              <Badge className={ROLE_COLORS[userRole]}>
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </Badge>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-sand-200 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-sand-100 text-sand-600 cursor-pointer"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <div>
                <h1 className="text-lg font-bold text-sand-900">
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard
                </h1>
                <p className="text-sm text-sand-500">
                  Welcome back, {userName.split(" ")[0]}!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-xl hover:bg-sand-100 text-sand-500 transition-colors cursor-pointer">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
              </button>
              <button className="p-2 rounded-xl hover:bg-sand-100 text-sand-500 transition-colors cursor-pointer">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
