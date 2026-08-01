"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  MapPin,
  GraduationCap,
  Send,
  Heart,
  MessageSquare,
  Briefcase,
  Globe,
  Calendar,
  User,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";
import {
  Card,
  Badge,
  Button,
  Avatar,
  Textarea,
  Input,
} from "@/components/ui";
import {
  fetchUserProfiles,
  fetchAlumniUpdates,
  createAlumniUpdate,
  fetchEvents,
  submitEventRSVP,
  updateUserProfile,
} from "@/lib/supabase/api";
import type { Profile, AlumniUpdate, EventItem } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function AlumniDashboard() {
  const [userName, setUserName] = useState("Alumni Member");
  const [userEmail, setUserEmail] = useState("alumni@icc.org");

  const [alumniList, setAlumniList] = useState<Profile[]>([]);
  const [updatesList, setUpdatesList] = useState<AlumniUpdate[]>([]);
  const [eventsList, setEventsList] = useState<EventItem[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rsvpFeedback, setRsvpFeedback] = useState<string | null>(null);

  // Profile Edit State
  const [bio, setBio] = useState("");
  const [profession, setProfession] = useState("");
  const [company, setCompany] = useState("");

  const refreshAlumniData = async () => {
    const profiles = await fetchUserProfiles();
    const alumni = profiles.filter((p) => p.role === "alumni");
    setAlumniList(alumni);

    const updates = await fetchAlumniUpdates();
    setUpdatesList(updates);

    const events = await fetchEvents();
    setEventsList(events);
  };

  useEffect(() => {
    const storedName = localStorage.getItem("icc_user_name") || "Alumni Member";
    const storedEmail = localStorage.getItem("icc_user_email") || "alumni@icc.org";
    setUserName(storedName);
    setUserEmail(storedEmail);

    refreshAlumniData();
  }, []);

  /* ===== Post Community Update ===== */
  const handlePostUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    setIsSubmitting(true);
    const res = await createAlumniUpdate(userName, newPostContent);
    setIsSubmitting(false);

    if (res.success) {
      setNewPostContent("");
      refreshAlumniData();
    }
  };

  /* ===== Event RSVP ===== */
  const handleRSVP = async (eventId: string, eventTitle: string) => {
    const res = await submitEventRSVP({
      event_id: eventId,
      name: userName,
      email: userEmail,
    });

    if (res.success) {
      setRsvpFeedback(`RSVP confirmed for "${eventTitle}"!`);
      setTimeout(() => setRsvpFeedback(null), 4000);
    }
  };

  const filteredAlumni = alumniList.filter(
    (a) =>
      a.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.job_title && a.job_title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* RSVP Feedback Banner */}
      {rsvpFeedback && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{rsvpFeedback}</span>
        </div>
      )}

      {/* Stats Header */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Registered Alumni", value: String(alumniList.length || 850), icon: Users, color: "from-emerald-500 to-emerald-600" },
          { label: "Community Feed", value: String(updatesList.length || 12), icon: MessageSquare, color: "from-blue-500 to-blue-600" },
          { label: "Alumni Galas & Events", value: String(eventsList.length || 4), icon: Calendar, color: "from-purple-500 to-purple-600" },
          { label: "Global Network", value: "Active", icon: Globe, color: "from-gold-500 to-gold-600" },
        ].map((stat) => (
          <Card key={stat.label} className="relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-sand-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-sand-900">{stat.value}</p>
              </div>
              <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Alumni Directory & Events */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Alumni Directory */}
          <Card id="directory">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-sand-900">ASMAR Alumni Directory</h3>
                <p className="text-xs text-sand-500">Connect with verified graduates of ICC</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sand-400" />
                <input
                  type="text"
                  placeholder="Search by name, email or job..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 rounded-xl border border-sand-200 text-sm w-full focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredAlumni.length === 0 ? (
                <p className="text-xs text-sand-400 italic py-4 text-center">No alumni matching your search.</p>
              ) : (
                filteredAlumni.map((alumnus) => (
                  <div
                    key={alumnus.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-sand-100 hover:border-emerald-200 hover:shadow-sm transition-all group"
                  >
                    <Avatar name={alumnus.full_name} size="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sand-900 group-hover:text-emerald-700 transition-colors">
                          {alumnus.full_name}
                        </h4>
                        <Badge variant="gold">
                          Class of {alumnus.graduation_year || "2024"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-sand-500">
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-3.5 w-3.5 text-emerald-600" />
                          {alumnus.email}
                        </span>
                        {alumnus.job_title && (
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3.5 w-3.5 text-gold-600" />
                            {alumnus.job_title} {alumnus.company && `@ ${alumnus.company}`}
                          </span>
                        )}
                      </div>
                    </div>
                    <a href={`mailto:${alumnus.email}`}>
                      <Button variant="outline" size="sm" className="shrink-0 text-xs">
                        Email
                      </Button>
                    </a>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Upcoming Alumni Events */}
          <Card>
            <h3 className="text-lg font-bold text-sand-900 mb-4">Upcoming Galas & Events</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {eventsList.map((event) => (
                <div key={event.id} className="p-4 rounded-xl border border-sand-100 bg-sand-50 flex flex-col justify-between">
                  <div>
                    <Badge variant="gold" className="mb-2 text-[10px]">
                      {event.date} • {event.time}
                    </Badge>
                    <h4 className="font-bold text-sand-900 text-sm mb-1">{event.title}</h4>
                    <p className="text-xs text-sand-500 line-clamp-2 mb-3">{event.description}</p>
                  </div>
                  <div className="pt-3 border-t border-sand-200 flex items-center justify-between">
                    <span className="text-[10px] text-sand-400">📍 {event.location}</span>
                    <Button size="sm" onClick={() => handleRSVP(event.id, event.title)}>
                      RSVP Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Community Discussion Feed */}
        <div className="space-y-6">
          {/* Post Update Form */}
          <Card id="community">
            <h3 className="text-lg font-bold text-sand-900 mb-3 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-emerald-600" /> Share an Alumni Update
            </h3>
            <form onSubmit={handlePostUpdate} className="space-y-3">
              <Textarea
                placeholder={`What's on your mind, ${userName.split(" ")[0]}? Share career news or reunion thoughts...`}
                rows={3}
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                required
              />
              <Button type="submit" size="sm" className="w-full font-bold" disabled={isSubmitting || !newPostContent.trim()}>
                {isSubmitting ? "Publishing..." : "Post to Alumni Feed"}
              </Button>
            </form>
          </Card>

          {/* Live Discussion Feed */}
          <Card>
            <h3 className="text-lg font-bold text-sand-900 mb-4">ASMAR Discussion Feed</h3>
            <div className="space-y-4">
              {updatesList.map((post) => (
                <div key={post.id} className="p-4 rounded-xl bg-sand-50 border border-sand-100">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar name={post.author_name} size="sm" />
                    <div>
                      <p className="font-bold text-sand-900 text-xs">{post.author_name}</p>
                      <p className="text-[10px] text-sand-400">{formatDate(post.created_at)}</p>
                    </div>
                  </div>
                  <p className="text-xs text-sand-700 leading-relaxed whitespace-pre-line">{post.content}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
