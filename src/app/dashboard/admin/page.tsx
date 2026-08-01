"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Megaphone,
  Calendar,
  Image as ImageIcon,
  DollarSign,
  TrendingUp,
  Plus,
  Pencil,
  Trash2,
  Search,
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Home,
  Upload,
  GraduationCap,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  Button,
  Badge,
  Input,
  Textarea,
  Select,
  Modal,
  Avatar,
} from "@/components/ui";
import { ANNOUNCEMENTS, EVENTS, DONATIONS, GALLERY_ITEMS, PROGRAMS } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  fetchAnnouncements,
  fetchEvents,
  fetchDonations,
  fetchUserProfiles,
  fetchGalleryItems,
  fetchPrograms,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  createEvent,
  updateEvent,
  deleteEvent,
  createGalleryItem,
  deleteGalleryItem,
  createUserProfile,
  updateUserProfile,
  updateUserRole,
  deleteUserProfile,
  createProgram,
  updateProgram,
  deleteProgram,
  uploadImageToSupabase,
} from "@/lib/supabase/api";
import type { Announcement, EventItem, Donation, Profile, GalleryItem, UserRole, Program } from "@/lib/types";

/* ===== Mock Fallback Users ===== */
const MOCK_USERS: Profile[] = [
  { id: "1", full_name: "Aisha Rahman", email: "aisha@email.com", role: "student", is_active: true, created_at: "2025-09-01" },
  { id: "2", full_name: "Omar Hassan", email: "omar@email.com", role: "alumni", is_active: true, created_at: "2024-06-15" },
  { id: "3", full_name: "Fatima Sayed", email: "fatima@email.com", role: "student", is_active: true, created_at: "2025-01-20" },
  { id: "4", full_name: "Ibrahim Khalil", email: "ibrahim@email.com", role: "admin", is_active: true, created_at: "2023-03-10" },
  { id: "5", full_name: "Mariam Yusuf", email: "mariam@email.com", role: "alumni", is_active: false, created_at: "2024-11-05" },
  { id: "6", full_name: "Zaid Ahmed", email: "zaid@email.com", role: "student", is_active: true, created_at: "2026-01-08" },
];

const ROLE_BADGE: Record<string, "success" | "info" | "warning" | "gold"> = {
  admin: "warning",
  student: "info",
  alumni: "gold",
};

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<"overview" | "programs" | "users" | "announcements" | "events" | "gallery" | "donations">(
    (tabParam as any) || "overview"
  );

  useEffect(() => {
    if (tabParam && ["overview", "programs", "users", "announcements", "events", "gallery", "donations"].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [tabParam]);

  // Create Modals
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showProgramModal, setShowProgramModal] = useState(false);

  // Edit State & Modals
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Live Backend Data States
  const [usersList, setUsersList] = useState<Profile[]>(MOCK_USERS);
  const [announcementsList, setAnnouncementsList] = useState<Announcement[]>(ANNOUNCEMENTS as Announcement[]);
  const [eventsList, setEventsList] = useState<EventItem[]>(EVENTS as EventItem[]);
  const [galleryList, setGalleryList] = useState<GalleryItem[]>(GALLERY_ITEMS as GalleryItem[]);
  const [donationsList, setDonationsList] = useState<Donation[]>(DONATIONS as Donation[]);
  const [programsList, setProgramsList] = useState<Program[]>(PROGRAMS as Program[]);

  // User Form
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState<UserRole>("student");

  // Announcement Form
  const [annTitle, setAnnTitle] = useState("");
  const [annContent, setAnnContent] = useState("");
  const [annPriority, setAnnPriority] = useState<any>("low");
  const [annTarget, setAnnTarget] = useState<any>("all");

  // Event Form
  const [eventTitle, setEventTitle] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLoc, setEventLoc] = useState("");

  // Gallery Form & Storage File State
  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryCategory, setGalleryCategory] = useState("Events");
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [galleryPreviewUrl, setGalleryPreviewUrl] = useState<string>("");

  // Program Builder Form State
  const [progTitle, setProgTitle] = useState("");
  const [progDesc, setProgDesc] = useState("");
  const [progCategory, setProgCategory] = useState<any>("education");
  const [progFullContent, setProgFullContent] = useState("");
  const [progSchedule, setProgSchedule] = useState("Mon - Fri, 8:00 AM - 2:00 PM");
  const [progContactEmail, setProgContactEmail] = useState("admissions@icc.org");
  const [progCtaText, setProgCtaText] = useState("Register / Get In Touch");
  const [progFile, setProgFile] = useState<File | null>(null);

  const refreshAllData = async () => {
    const dbUsers = await fetchUserProfiles();
    if (dbUsers.length > 0) setUsersList(dbUsers);

    const dbAnn = await fetchAnnouncements("admin");
    if (dbAnn.length > 0) setAnnouncementsList(dbAnn);

    const dbEvents = await fetchEvents();
    if (dbEvents.length > 0) setEventsList(dbEvents);

    const dbGallery = await fetchGalleryItems();
    if (dbGallery.length > 0) setGalleryList(dbGallery);

    const dbDonations = await fetchDonations();
    if (dbDonations.length > 0) setDonationsList(dbDonations);

    const dbPrograms = await fetchPrograms();
    if (dbPrograms.length > 0) setProgramsList(dbPrograms);
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const triggerFeedback = (type: "success" | "error", message: string) => {
    setActionFeedback({ type, message });
    setTimeout(() => setActionFeedback(null), 4000);
  };

  /* ===== Program Builder Handlers ===== */
  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let imageUrl = "";
    if (progFile) {
      const uploadRes = await uploadImageToSupabase(progFile, "events");
      if (uploadRes.success && uploadRes.url) {
        imageUrl = uploadRes.url;
      }
    }

    const result = await createProgram({
      title: progTitle,
      description: progDesc,
      category: progCategory,
      full_content: progFullContent,
      schedule: progSchedule,
      contact_email: progContactEmail,
      cta_text: progCtaText,
      image_url: imageUrl || undefined,
    });
    setIsSubmitting(false);

    if (result.success) {
      triggerFeedback("success", `Program "${progTitle}" created! Live detail page active.`);
      refreshAllData();
      setShowProgramModal(false);
      setProgTitle("");
      setProgDesc("");
      setProgFullContent("");
      setProgFile(null);
    } else {
      triggerFeedback("error", result.error || "Failed to create program");
    }
  };

  const handleUpdateProgramSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProgram) return;
    setIsSubmitting(true);

    const result = await updateProgram(editingProgram.id, {
      title: editingProgram.title,
      description: editingProgram.description,
      category: editingProgram.category,
      full_content: editingProgram.full_content,
      schedule: editingProgram.schedule,
      contact_email: editingProgram.contact_email,
      cta_text: editingProgram.cta_text,
    });
    setIsSubmitting(false);

    if (result.success) {
      triggerFeedback("success", "Program builder details updated!");
      setProgramsList(programsList.map((p) => (p.id === editingProgram.id ? editingProgram : p)));
      setEditingProgram(null);
      refreshAllData();
    } else {
      triggerFeedback("error", result.error || "Failed to update program");
    }
  };

  const handleDeleteProgram = async (id: string) => {
    const result = await deleteProgram(id);
    if (result.success) {
      triggerFeedback("success", "Program deleted");
      setProgramsList(programsList.filter((p) => p.id !== id));
      refreshAllData();
    } else {
      triggerFeedback("error", result.error || "Failed to delete program");
    }
  };

  /* ===== User Handlers ===== */
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await createUserProfile({
      full_name: userName,
      email: userEmail,
      role: userRole,
    });
    setIsSubmitting(false);

    if (result.success) {
      triggerFeedback("success", "User profile created successfully!");
      refreshAllData();
    } else {
      triggerFeedback("error", result.error || "Failed to create user profile");
    }

    setShowUserModal(false);
    setUserName("");
    setUserEmail("");
    setUserRole("student");
  };

  const handleUpdateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsSubmitting(true);

    const result = await updateUserProfile(editingUser.id, {
      full_name: editingUser.full_name,
      email: editingUser.email,
      role: editingUser.role,
    });
    setIsSubmitting(false);

    if (result.success) {
      triggerFeedback("success", "User profile updated successfully!");
      setUsersList(usersList.map((u) => (u.id === editingUser.id ? editingUser : u)));
      setEditingUser(null);
    } else {
      triggerFeedback("error", result.error || "Failed to update user profile");
    }
  };

  const handleDeleteUser = async (id: string) => {
    const result = await deleteUserProfile(id);
    if (result.success) {
      triggerFeedback("success", "User deleted");
      setUsersList(usersList.filter((u) => u.id !== id));
    } else {
      triggerFeedback("error", result.error || "Failed to delete user");
    }
  };

  const handleRoleToggle = async (id: string, currentRole: UserRole) => {
    const nextRole: UserRole = currentRole === "student" ? "alumni" : currentRole === "alumni" ? "admin" : "student";
    const result = await updateUserRole(id, nextRole);
    if (result.success) {
      triggerFeedback("success", `Role updated to ${nextRole}`);
      setUsersList(usersList.map((u) => (u.id === id ? { ...u, role: nextRole } : u)));
    } else {
      triggerFeedback("error", result.error || "Failed to update role");
    }
  };

  /* ===== Announcement Handlers ===== */
  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await createAnnouncement({
      title: annTitle,
      content: annContent,
      priority: annPriority,
      target_role: annTarget,
    });
    setIsSubmitting(false);

    if (result.success) {
      triggerFeedback("success", "Announcement published!");
      refreshAllData();
    } else {
      triggerFeedback("error", result.error || "Failed to publish announcement");
    }

    setShowAnnouncementModal(false);
    setAnnTitle("");
    setAnnContent("");
  };

  const handleUpdateAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnnouncement) return;
    setIsSubmitting(true);

    const result = await updateAnnouncement(editingAnnouncement.id, {
      title: editingAnnouncement.title,
      content: editingAnnouncement.content,
      priority: editingAnnouncement.priority,
      target_role: editingAnnouncement.target_role,
    });
    setIsSubmitting(false);

    if (result.success) {
      triggerFeedback("success", "Announcement updated successfully!");
      setAnnouncementsList(
        announcementsList.map((a) => (a.id === editingAnnouncement.id ? editingAnnouncement : a))
      );
      setEditingAnnouncement(null);
    } else {
      triggerFeedback("error", result.error || "Failed to update announcement");
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    const result = await deleteAnnouncement(id);
    if (result.success) {
      triggerFeedback("success", "Announcement deleted");
      setAnnouncementsList(announcementsList.filter((a) => a.id !== id));
    } else {
      triggerFeedback("error", result.error || "Failed to delete announcement");
    }
  };

  /* ===== Event Handlers ===== */
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await createEvent({
      title: eventTitle,
      description: eventDesc,
      date: eventDate,
      time: eventTime,
      location: eventLoc,
    });
    setIsSubmitting(false);

    if (result.success) {
      triggerFeedback("success", "Event created! Visible live on landing page.");
      refreshAllData();
    } else {
      triggerFeedback("error", result.error || "Failed to create event");
    }

    setShowEventModal(false);
    setEventTitle("");
    setEventDesc("");
    setEventDate("");
    setEventTime("");
    setEventLoc("");
  };

  const handleUpdateEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    setIsSubmitting(true);

    const result = await updateEvent(editingEvent.id, {
      title: editingEvent.title,
      description: editingEvent.description,
      date: editingEvent.date,
      time: editingEvent.time,
      location: editingEvent.location,
    });
    setIsSubmitting(false);

    if (result.success) {
      triggerFeedback("success", "Event updated! Live updates applied.");
      setEventsList(eventsList.map((ev) => (ev.id === editingEvent.id ? editingEvent : ev)));
      setEditingEvent(null);
      refreshAllData();
    } else {
      triggerFeedback("error", result.error || "Failed to update event");
    }
  };

  const handleDeleteEvent = async (id: string) => {
    const result = await deleteEvent(id);
    if (result.success) {
      triggerFeedback("success", "Event deleted");
      setEventsList(eventsList.filter((ev) => ev.id !== id));
      refreshAllData();
    } else {
      triggerFeedback("error", result.error || "Failed to delete event");
    }
  };

  /* ===== Gallery Handlers ===== */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGalleryFile(file);
      setGalleryPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCreateGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryFile) {
      triggerFeedback("error", "Please select an image file to upload.");
      return;
    }

    setIsSubmitting(true);
    const uploadRes = await uploadImageToSupabase(galleryFile, "gallery");
    if (!uploadRes.success || !uploadRes.url) {
      setIsSubmitting(false);
      triggerFeedback("error", uploadRes.error || "Failed to upload image file to Supabase Storage");
      return;
    }

    const result = await createGalleryItem({
      title: galleryTitle,
      category: galleryCategory,
      image_url: uploadRes.url,
    });
    setIsSubmitting(false);

    if (result.success) {
      triggerFeedback("success", "Image uploaded to Supabase Storage & saved to gallery!");
      refreshAllData();
      setShowGalleryModal(false);
      setGalleryTitle("");
      setGalleryFile(null);
      setGalleryPreviewUrl("");
    } else {
      triggerFeedback("error", result.error || "Failed to save gallery record");
    }
  };

  const handleDeleteGallery = async (id: string) => {
    const result = await deleteGalleryItem(id);
    if (result.success) {
      triggerFeedback("success", "Photo deleted");
      setGalleryList(galleryList.filter((g) => g.id !== id));
    } else {
      triggerFeedback("error", result.error || "Failed to delete photo");
    }
  };

  /* ===== Calculations ===== */
  const totalDonations = donationsList.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const avgDonation = donationsList.length > 0 ? totalDonations / donationsList.length : 0;

  const filteredUsers = usersList.filter(
    (u) =>
      u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Feedback Banner */}
      {actionFeedback && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-sm font-medium ${
            actionFeedback.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {actionFeedback.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
            )}
            <span>{actionFeedback.message}</span>
          </div>
          <button onClick={() => setActionFeedback(null)} className="text-xs underline font-bold cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Stats Grid Header */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: String(usersList.length), change: "Live Sync", icon: Users, color: "from-emerald-500 to-emerald-600" },
          { label: "Active Programs", value: String(programsList.length), change: "Program Builder", icon: GraduationCap, color: "from-teal-500 to-teal-600" },
          { label: "Events", value: String(eventsList.length), change: "Upcoming", icon: Calendar, color: "from-purple-500 to-purple-600" },
          { label: "Donations", value: formatCurrency(totalDonations), change: `${donationsList.length} Raised`, icon: DollarSign, color: "from-gold-500 to-gold-600" },
        ].map((stat) => (
          <Card key={stat.label} className="relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-sand-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-sand-900">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                  <span className="text-xs font-medium text-emerald-600">{stat.change}</span>
                </div>
              </div>
              <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 border-b border-sand-200">
        {[
          { key: "overview", label: "Overview", icon: Home },
          { key: "programs", label: `Programs Builder (${programsList.length})`, icon: GraduationCap },
          { key: "users", label: `Users (${usersList.length})`, icon: Users },
          { key: "announcements", label: `Announcements (${announcementsList.length})`, icon: Megaphone },
          { key: "events", label: `Events (${eventsList.length})`, icon: Calendar },
          { key: "gallery", label: `Gallery (${galleryList.length})`, icon: ImageIcon },
          { key: "donations", label: `Donations (${donationsList.length})`, icon: DollarSign },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.key
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-bold"
                : "bg-white text-sand-600 hover:bg-sand-50 border border-sand-200"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-white border border-sand-200 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-sand-400 mr-2">
              Quick Admin Actions:
            </span>
            <Button size="sm" onClick={() => setShowProgramModal(true)}>
              <Plus className="h-4 w-4" /> Create New Program
            </Button>
            <Button size="sm" variant="gold" onClick={() => setShowAnnouncementModal(true)}>
              <Plus className="h-4 w-4" /> New Announcement
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setShowEventModal(true)}>
              <Plus className="h-4 w-4" /> New Event
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowGalleryModal(true)}>
              <Upload className="h-4 w-4" /> Upload Photo File
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sand-900 text-base">Active Programs Builder</h3>
                <button onClick={() => setActiveTab("programs")} className="text-xs font-bold text-emerald-600 hover:underline">
                  Manage Programs →
                </button>
              </div>
              <div className="space-y-3">
                {programsList.slice(0, 3).map((prog) => (
                  <div key={prog.id} className="p-3 rounded-xl bg-sand-50 border border-sand-100 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-sm text-sand-900">{prog.title}</p>
                      <p className="text-xs text-sand-500 line-clamp-1">{prog.description}</p>
                    </div>
                    <Link href={`/programs/${prog.id}`} target="_blank" className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sand-900 text-base">Upcoming Events</h3>
                <button onClick={() => setActiveTab("events")} className="text-xs font-bold text-emerald-600 hover:underline">
                  View All →
                </button>
              </div>
              <div className="space-y-3">
                {eventsList.slice(0, 3).map((event) => (
                  <div key={event.id} className="p-3 rounded-xl bg-sand-50 border border-sand-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-sand-900">{event.title}</p>
                        <p className="text-xs text-sand-400">{event.date} • {event.time}</p>
                      </div>
                    </div>
                    <Badge variant="gold">{event.location}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Program Builder Tab */}
      {activeTab === "programs" && (
        <Card id="programs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-sand-900">Program Builder Control Panel</h3>
              <p className="text-xs text-sand-500">Create & manage detailed program pages (e.g. English Medium School, Quranic Studies)</p>
            </div>
            <Button size="sm" onClick={() => setShowProgramModal(true)}>
              <Plus className="h-4 w-4" /> Create New Program
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programsList.map((program) => (
              <div key={program.id} className="p-5 rounded-2xl border border-sand-200 bg-white hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="success" className="uppercase text-[10px]">
                      {program.category}
                    </Badge>
                    <Link
                      href={`/programs/${program.id}`}
                      target="_blank"
                      className="text-xs text-emerald-600 font-bold hover:underline inline-flex items-center gap-1"
                    >
                      View Live Page <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                  <h4 className="font-bold text-sand-900 text-lg mb-2">{program.title}</h4>
                  <p className="text-sm text-sand-500 line-clamp-3 mb-4">{program.description}</p>
                </div>

                <div className="pt-4 border-t border-sand-100 flex items-center justify-between">
                  <span className="text-xs text-sand-400 font-medium">
                    📅 {program.schedule || "Flexible"}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingProgram(program)}
                      className="p-2 rounded-lg hover:bg-sand-100 text-sand-500 hover:text-emerald-600 cursor-pointer"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProgram(program.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-sand-500 hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <Card id="users">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-bold text-sand-900">User Management</h3>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sand-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 rounded-xl border border-sand-200 text-sm w-full focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                />
              </div>
              <Button size="sm" onClick={() => setShowUserModal(true)}>
                <Plus className="h-4 w-4" /> Add User
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sand-100">
                  <th className="text-left px-6 py-3 text-sand-500 font-medium">User</th>
                  <th className="text-left px-6 py-3 text-sand-500 font-medium">Role</th>
                  <th className="text-left px-6 py-3 text-sand-500 font-medium hidden md:table-cell">Status</th>
                  <th className="text-left px-6 py-3 text-sand-500 font-medium hidden lg:table-cell">Joined</th>
                  <th className="text-right px-6 py-3 text-sand-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-sand-50 hover:bg-sand-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.full_name} size="sm" />
                        <div>
                          <p className="font-medium text-sand-900">{user.full_name}</p>
                          <p className="text-xs text-sand-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleRoleToggle(user.id, user.role)}
                        title="Click to toggle role"
                        className="cursor-pointer"
                      >
                        <Badge variant={ROLE_BADGE[user.role]}>{user.role} 🔄</Badge>
                      </button>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${user.is_active !== false ? "text-emerald-600" : "text-sand-400"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${user.is_active !== false ? "bg-emerald-500" : "bg-sand-300"}`} />
                        {user.is_active !== false ? "active" : "inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-sand-500">{formatDate(user.created_at)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="p-2 rounded-lg hover:bg-sand-100 text-sand-400 hover:text-emerald-600 transition-colors cursor-pointer"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-sand-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Announcements Tab */}
      {activeTab === "announcements" && (
        <Card id="announcements">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-sand-900">Announcements</h3>
            <Button size="sm" onClick={() => setShowAnnouncementModal(true)}>
              <Plus className="h-4 w-4" /> New Announcement
            </Button>
          </div>
          <div className="space-y-4">
            {announcementsList.map((ann) => (
              <div key={ann.id} className="flex items-start gap-4 p-4 rounded-xl border border-sand-100 hover:bg-sand-50/50 transition-colors">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                  ann.priority === "high" ? "bg-red-100 text-red-600" :
                  ann.priority === "medium" ? "bg-amber-100 text-amber-600" :
                  "bg-blue-100 text-blue-600"
                }`}>
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sand-900">{ann.title}</h4>
                    <Badge variant={ann.priority === "high" ? "warning" : "default"}>
                      {ann.priority}
                    </Badge>
                    <Badge variant="success">{ann.target_role}</Badge>
                  </div>
                  <p className="text-sm text-sand-500 line-clamp-2">{ann.content}</p>
                  <p className="text-xs text-sand-400 mt-2">{formatDate(ann.created_at)}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => setEditingAnnouncement(ann)}
                    className="p-2 rounded-lg hover:bg-sand-100 text-sand-400 hover:text-emerald-600 cursor-pointer"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAnnouncement(ann.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-sand-400 hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Events Tab */}
      {activeTab === "events" && (
        <Card id="events">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-sand-900">Event Management</h3>
            <Button size="sm" onClick={() => setShowEventModal(true)}>
              <Plus className="h-4 w-4" /> New Event
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {eventsList.map((event) => (
              <div key={event.id} className="p-4 rounded-xl border border-sand-100 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sand-900">{event.title}</h4>
                      <p className="text-xs text-sand-400">{formatDate(event.date)} • {event.time}</p>
                    </div>
                  </div>
                  {event.is_featured && <Badge variant="gold">Featured</Badge>}
                </div>
                <p className="text-sm text-sand-500 mb-3 line-clamp-2">{event.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-sand-400">📍 {event.location}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingEvent(event)}
                      className="p-1.5 rounded-lg hover:bg-sand-100 text-sand-400 hover:text-emerald-600 cursor-pointer"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-sand-400 hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Gallery Tab */}
      {activeTab === "gallery" && (
        <Card id="gallery">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-sand-900">Gallery Manager</h3>
              <p className="text-xs text-sand-500">Upload images directly to Supabase Storage</p>
            </div>
            <Button size="sm" onClick={() => setShowGalleryModal(true)}>
              <Upload className="h-4 w-4" /> Upload Image File
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryList.map((item) => (
              <div key={item.id} className="group relative aspect-square rounded-xl bg-sand-100 border border-sand-200 overflow-hidden">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-sand-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleDeleteGallery(item.id)}
                    className="p-2 rounded-full bg-white/90 text-red-500 hover:bg-white cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <p className="text-white text-xs font-bold truncate">{item.title}</p>
                  <p className="text-[10px] text-gold-300 font-medium">{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Donations Tab */}
      {activeTab === "donations" && (
        <Card id="donations">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-sand-900">Donation Analytics</h3>
            <Badge variant="success">
              <TrendingUp className="h-3 w-3" /> Live Backend Connected
            </Badge>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Raised", value: formatCurrency(totalDonations), color: "text-emerald-600" },
              { label: "Total Donors", value: String(donationsList.length), color: "text-blue-600" },
              { label: "Avg. Donation", value: formatCurrency(avgDonation), color: "text-gold-600" },
              { label: "Categories", value: "4 Funds", color: "text-purple-600" },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-xl bg-sand-50 border border-sand-100">
                <p className="text-xs text-sand-500 mb-1">{item.label}</p>
                <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>

          <h4 className="font-semibold text-sand-900 mb-3">Recent Donations</h4>
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sand-100">
                  <th className="text-left px-6 py-3 text-sand-500 font-medium">Donor</th>
                  <th className="text-left px-6 py-3 text-sand-500 font-medium">Amount</th>
                  <th className="text-left px-6 py-3 text-sand-500 font-medium hidden md:table-cell">Category</th>
                  <th className="text-left px-6 py-3 text-sand-500 font-medium hidden lg:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {donationsList.map((d) => (
                  <tr key={d.id} className="border-b border-sand-50 hover:bg-sand-50/50">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={d.is_anonymous ? "?" : d.donor_name} size="sm" />
                        <span className="font-medium text-sand-900">
                          {d.is_anonymous ? "Anonymous" : d.donor_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3 font-semibold text-emerald-600">{formatCurrency(d.amount)}</td>
                    <td className="px-6 py-3 hidden md:table-cell">
                      <Badge variant="gold">{d.category}</Badge>
                    </td>
                    <td className="px-6 py-3 hidden lg:table-cell text-sand-500">{formatDate(d.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Program Create Modal */}
      <Modal
        isOpen={showProgramModal}
        onClose={() => setShowProgramModal(false)}
        title="Create New Program (e.g. English Medium School)"
      >
        <form className="space-y-4" onSubmit={handleCreateProgram}>
          <Input
            label="Program Title"
            placeholder="e.g. English Medium School"
            value={progTitle}
            onChange={(e) => setProgTitle(e.target.value)}
            required
          />
          <Select
            label="Category"
            value={progCategory}
            onChange={(e) => setProgCategory(e.target.value as any)}
            options={[
              { value: "education", label: "Education" },
              { value: "quran", label: "Quranic Studies" },
              { value: "youth", label: "Youth & Leadership" },
              { value: "relief", label: "Community Relief" },
            ]}
          />
          <Textarea
            label="Short Description"
            placeholder="Brief overview summary..."
            rows={2}
            value={progDesc}
            onChange={(e) => setProgDesc(e.target.value)}
            required
          />
          <Textarea
            label="Full Page Content / Curriculum / Introduction"
            placeholder="Write full detailed curriculum, introduction, and section content for this program..."
            rows={5}
            value={progFullContent}
            onChange={(e) => setProgFullContent(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Schedule"
              placeholder="e.g. Mon - Fri, 8 AM - 2 PM"
              value={progSchedule}
              onChange={(e) => setProgSchedule(e.target.value)}
            />
            <Input
              label="Contact Email"
              placeholder="admissions@icc.org"
              value={progContactEmail}
              onChange={(e) => setProgContactEmail(e.target.value)}
            />
          </div>
          <Input
            label="CTA Button Text"
            placeholder="e.g. Register for English Medium School"
            value={progCtaText}
            onChange={(e) => setProgCtaText(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-sand-800">
              Banner / Cover Image File (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProgFile(e.target.files?.[0] || null)}
              className="text-xs text-sand-600"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating Program..." : "Create & Publish Program"}
          </Button>
        </form>
      </Modal>

      {/* Program Edit Modal */}
      <Modal
        isOpen={!!editingProgram}
        onClose={() => setEditingProgram(null)}
        title="Edit Program Details"
      >
        {editingProgram && (
          <form className="space-y-4" onSubmit={handleUpdateProgramSubmit}>
            <Input
              label="Program Title"
              value={editingProgram.title}
              onChange={(e) => setEditingProgram({ ...editingProgram, title: e.target.value })}
              required
            />
            <Select
              label="Category"
              value={editingProgram.category}
              onChange={(e) => setEditingProgram({ ...editingProgram, category: e.target.value as any })}
              options={[
                { value: "education", label: "Education" },
                { value: "quran", label: "Quranic Studies" },
                { value: "youth", label: "Youth & Leadership" },
                { value: "relief", label: "Community Relief" },
              ]}
            />
            <Textarea
              label="Short Description"
              rows={2}
              value={editingProgram.description}
              onChange={(e) => setEditingProgram({ ...editingProgram, description: e.target.value })}
              required
            />
            <Textarea
              label="Full Page Content / Curriculum"
              rows={5}
              value={editingProgram.full_content || ""}
              onChange={(e) => setEditingProgram({ ...editingProgram, full_content: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Schedule"
                value={editingProgram.schedule || ""}
                onChange={(e) => setEditingProgram({ ...editingProgram, schedule: e.target.value })}
              />
              <Input
                label="Contact Email"
                value={editingProgram.contact_email || ""}
                onChange={(e) => setEditingProgram({ ...editingProgram, contact_email: e.target.value })}
              />
            </div>
            <Input
              label="CTA Button Text"
              value={editingProgram.cta_text || ""}
              onChange={(e) => setEditingProgram({ ...editingProgram, cta_text: e.target.value })}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Program Changes"}
            </Button>
          </form>
        )}
      </Modal>

      {/* User Create Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title="Add New User Profile"
      >
        <form className="space-y-4" onSubmit={handleAddUser}>
          <Input label="Full Name" placeholder="Full name" value={userName} onChange={(e) => setUserName(e.target.value)} required />
          <Input label="Email Address" type="email" placeholder="user@example.com" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required />
          <Select
            label="Role"
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as UserRole)}
            options={[
              { value: "student", label: "Student" },
              { value: "alumni", label: "Alumni" },
              { value: "admin", label: "Admin" },
            ]}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create User Profile"}
          </Button>
        </form>
      </Modal>

      {/* User Edit Modal */}
      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title="Edit User Profile"
      >
        {editingUser && (
          <form className="space-y-4" onSubmit={handleUpdateUserSubmit}>
            <Input
              label="Full Name"
              value={editingUser.full_name}
              onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={editingUser.email}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              required
            />
            <Select
              label="Role"
              value={editingUser.role}
              onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
              options={[
                { value: "student", label: "Student" },
                { value: "alumni", label: "Alumni" },
                { value: "admin", label: "Admin" },
              ]}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save User Changes"}
            </Button>
          </form>
        )}
      </Modal>

      {/* Announcement Create Modal */}
      <Modal
        isOpen={showAnnouncementModal}
        onClose={() => setShowAnnouncementModal(false)}
        title="New Announcement"
      >
        <form className="space-y-4" onSubmit={handleCreateAnnouncement}>
          <Input label="Title" placeholder="Announcement title" value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} required />
          <Textarea label="Content" placeholder="Write your announcement..." rows={4} value={annContent} onChange={(e) => setAnnContent(e.target.value)} required />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority"
              value={annPriority}
              onChange={(e) => setAnnPriority(e.target.value)}
              options={[
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
              ]}
            />
            <Select
              label="Target Audience"
              value={annTarget}
              onChange={(e) => setAnnTarget(e.target.value)}
              options={[
                { value: "all", label: "Everyone" },
                { value: "student", label: "Students" },
                { value: "alumni", label: "Alumni" },
              ]}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Publishing..." : "Publish Announcement"}
          </Button>
        </form>
      </Modal>

      {/* Announcement Edit Modal */}
      <Modal
        isOpen={!!editingAnnouncement}
        onClose={() => setEditingAnnouncement(null)}
        title="Edit Announcement"
      >
        {editingAnnouncement && (
          <form className="space-y-4" onSubmit={handleUpdateAnnouncementSubmit}>
            <Input
              label="Title"
              value={editingAnnouncement.title}
              onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
              required
            />
            <Textarea
              label="Content"
              rows={4}
              value={editingAnnouncement.content}
              onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, content: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Priority"
                value={editingAnnouncement.priority}
                onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, priority: e.target.value as any })}
                options={[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                ]}
              />
              <Select
                label="Target Audience"
                value={editingAnnouncement.target_role}
                onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, target_role: e.target.value as any })}
                options={[
                  { value: "all", label: "Everyone" },
                  { value: "student", label: "Students" },
                  { value: "alumni", label: "Alumni" },
                ]}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Announcement Changes"}
            </Button>
          </form>
        )}
      </Modal>

      {/* Event Create Modal */}
      <Modal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        title="New Event"
      >
        <form className="space-y-4" onSubmit={handleCreateEvent}>
          <Input label="Event Title" placeholder="Event name" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} required />
          <Textarea label="Description" placeholder="Event description..." rows={3} value={eventDesc} onChange={(e) => setEventDesc(e.target.value)} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
            <Input label="Time" type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} required />
          </div>
          <Input label="Location" placeholder="Event venue" value={eventLoc} onChange={(e) => setEventLoc(e.target.value)} required />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Event"}
          </Button>
        </form>
      </Modal>

      {/* Event Edit Modal */}
      <Modal
        isOpen={!!editingEvent}
        onClose={() => setEditingEvent(null)}
        title="Edit Event"
      >
        {editingEvent && (
          <form className="space-y-4" onSubmit={handleUpdateEventSubmit}>
            <Input
              label="Event Title"
              value={editingEvent.title}
              onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
              required
            />
            <Textarea
              label="Description"
              rows={3}
              value={editingEvent.description}
              onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Date"
                type="date"
                value={editingEvent.date}
                onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                required
              />
              <Input
                label="Time"
                type="time"
                value={editingEvent.time}
                onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                required
              />
            </div>
            <Input
              label="Location"
              value={editingEvent.location}
              onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
              required
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Event Changes"}
            </Button>
          </form>
        )}
      </Modal>

      {/* Gallery File Upload Modal */}
      <Modal
        isOpen={showGalleryModal}
        onClose={() => {
          setShowGalleryModal(false);
          setGalleryFile(null);
          setGalleryPreviewUrl("");
        }}
        title="Upload Image File to Supabase Storage"
      >
        <form className="space-y-4" onSubmit={handleCreateGallery}>
          <Input
            label="Photo Title"
            placeholder="e.g. Annual Youth Iftar 2026"
            value={galleryTitle}
            onChange={(e) => setGalleryTitle(e.target.value)}
            required
          />

          <Select
            label="Category"
            value={galleryCategory}
            onChange={(e) => setGalleryCategory(e.target.value)}
            options={[
              { value: "Events", label: "Events" },
              { value: "Education", label: "Education" },
              { value: "Youth", label: "Youth" },
              { value: "Community", label: "Community" },
            ]}
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-sand-800">
              Select Image File from Device
            </label>
            <div className="p-4 rounded-xl border-2 border-dashed border-sand-300 hover:border-emerald-500 transition-colors bg-sand-50 text-center cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="gallery-file-input"
                required
              />
              <label htmlFor="gallery-file-input" className="cursor-pointer space-y-2 block">
                <Upload className="h-8 w-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-sand-700">
                  {galleryFile ? galleryFile.name : "Click to browse and select image file"}
                </p>
                <p className="text-[10px] text-sand-400">PNG, JPG, WEBP up to 10MB</p>
              </label>
            </div>
          </div>

          {galleryPreviewUrl && (
            <div className="relative aspect-video rounded-xl overflow-hidden border border-sand-200">
              <img src={galleryPreviewUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting || !galleryFile}>
            {isSubmitting ? "Uploading to Supabase Storage..." : "Upload to Supabase & Save"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sand-500 font-medium">Loading Dashboard...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
