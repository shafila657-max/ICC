"use client";

import React, { useState } from "react";
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
  Eye,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowUpRight,
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
  ProgressBar,
} from "@/components/ui";
import { ANNOUNCEMENTS, EVENTS, DONATIONS, GALLERY_ITEMS } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";

/* ===== Stats Cards ===== */
const ADMIN_STATS = [
  { label: "Total Users", value: "1,247", change: "+12%", icon: Users, color: "from-emerald-500 to-emerald-600" },
  { label: "Announcements", value: "24", change: "+3", icon: Megaphone, color: "from-blue-500 to-blue-600" },
  { label: "Events", value: "8", change: "+2", icon: Calendar, color: "from-purple-500 to-purple-600" },
  { label: "Donations", value: "$128K", change: "+18%", icon: DollarSign, color: "from-gold-500 to-gold-600" },
];

/* ===== Mock Users ===== */
const MOCK_USERS = [
  { id: "1", name: "Aisha Rahman", email: "aisha@email.com", role: "student" as const, status: "active" as const, joined: "2025-09-01" },
  { id: "2", name: "Omar Hassan", email: "omar@email.com", role: "alumni" as const, status: "active" as const, joined: "2024-06-15" },
  { id: "3", name: "Fatima Sayed", email: "fatima@email.com", role: "student" as const, status: "active" as const, joined: "2025-01-20" },
  { id: "4", name: "Ibrahim Khalil", email: "ibrahim@email.com", role: "admin" as const, status: "active" as const, joined: "2023-03-10" },
  { id: "5", name: "Mariam Yusuf", email: "mariam@email.com", role: "alumni" as const, status: "inactive" as const, joined: "2024-11-05" },
  { id: "6", name: "Zaid Ahmed", email: "zaid@email.com", role: "student" as const, status: "active" as const, joined: "2026-01-08" },
];

const ROLE_BADGE: Record<string, "success" | "info" | "warning" | "gold"> = {
  admin: "warning",
  student: "info",
  alumni: "gold",
};

export default function AdminDashboard() {
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"users" | "announcements" | "events" | "gallery" | "donations">("users");

  const filteredUsers = MOCK_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {ADMIN_STATS.map((stat) => (
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

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
        {[
          { key: "users", label: "Users", icon: Users },
          { key: "announcements", label: "Announcements", icon: Megaphone },
          { key: "events", label: "Events", icon: Calendar },
          { key: "gallery", label: "Gallery", icon: ImageIcon },
          { key: "donations", label: "Donations", icon: DollarSign },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.key
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white text-sand-600 hover:bg-sand-50 border border-sand-200"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

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
              <Button size="sm"><Plus className="h-4 w-4" /> Add User</Button>
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
                        <Avatar name={user.name} size="sm" />
                        <div>
                          <p className="font-medium text-sand-900">{user.name}</p>
                          <p className="text-xs text-sand-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={ROLE_BADGE[user.role]}>{user.role}</Badge>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${user.status === "active" ? "text-emerald-600" : "text-sand-400"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${user.status === "active" ? "bg-emerald-500" : "bg-sand-300"}`} />
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-sand-500">{formatDate(user.joined)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 rounded-lg hover:bg-sand-100 text-sand-400 hover:text-sand-600 transition-colors cursor-pointer">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-red-50 text-sand-400 hover:text-red-500 transition-colors cursor-pointer">
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
            {ANNOUNCEMENTS.map((ann) => (
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
                  <button className="p-2 rounded-lg hover:bg-sand-100 text-sand-400 cursor-pointer"><Pencil className="h-4 w-4" /></button>
                  <button className="p-2 rounded-lg hover:bg-red-50 text-sand-400 hover:text-red-500 cursor-pointer"><Trash2 className="h-4 w-4" /></button>
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
            {EVENTS.map((event) => (
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
                    <button className="p-1.5 rounded-lg hover:bg-sand-100 text-sand-400 cursor-pointer"><Eye className="h-4 w-4" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-sand-100 text-sand-400 cursor-pointer"><Pencil className="h-4 w-4" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-red-50 text-sand-400 hover:text-red-500 cursor-pointer"><Trash2 className="h-4 w-4" /></button>
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
            <h3 className="text-lg font-bold text-sand-900">Gallery Manager</h3>
            <Button size="sm"><Plus className="h-4 w-4" /> Upload Image</Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {GALLERY_ITEMS.map((item, i) => (
              <div key={item.id} className="group relative aspect-square rounded-xl bg-gradient-to-br from-emerald-200 to-emerald-300 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-emerald-500/30" />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button className="p-2 rounded-full bg-white/90 text-sand-700 hover:bg-white cursor-pointer"><Eye className="h-4 w-4" /></button>
                  <button className="p-2 rounded-full bg-white/90 text-red-500 hover:bg-white cursor-pointer"><Trash2 className="h-4 w-4" /></button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-white text-xs font-medium truncate">{item.title}</p>
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
              <TrendingUp className="h-3 w-3" /> +18% this month
            </Badge>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Raised", value: "$128,500", color: "text-emerald-600" },
              { label: "This Month", value: "$12,400", color: "text-blue-600" },
              { label: "Total Donors", value: "342", color: "text-purple-600" },
              { label: "Avg. Donation", value: "$375", color: "text-gold-600" },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-xl bg-sand-50 border border-sand-100">
                <p className="text-xs text-sand-500 mb-1">{item.label}</p>
                <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Recent Donations Table */}
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
                {DONATIONS.map((d) => (
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

      {/* Announcement Modal */}
      <Modal
        isOpen={showAnnouncementModal}
        onClose={() => setShowAnnouncementModal(false)}
        title="New Announcement"
      >
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowAnnouncementModal(false); }}>
          <Input label="Title" id="ann-title" placeholder="Announcement title" required />
          <Textarea label="Content" id="ann-content" placeholder="Write your announcement..." rows={4} required />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority"
              id="ann-priority"
              options={[
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
              ]}
            />
            <Select
              label="Target Audience"
              id="ann-target"
              options={[
                { value: "all", label: "Everyone" },
                { value: "student", label: "Students" },
                { value: "alumni", label: "Alumni" },
              ]}
            />
          </div>
          <Button type="submit" className="w-full">Publish Announcement</Button>
        </form>
      </Modal>

      {/* Event Modal */}
      <Modal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        title="New Event"
      >
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowEventModal(false); }}>
          <Input label="Event Title" id="event-title" placeholder="Event name" required />
          <Textarea label="Description" id="event-desc" placeholder="Event description..." rows={3} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" id="event-date" type="date" required />
            <Input label="Time" id="event-time" type="time" required />
          </div>
          <Input label="Location" id="event-location" placeholder="Event venue" required />
          <Input label="Max Attendees" id="event-max" type="number" placeholder="e.g. 100" />
          <Button type="submit" className="w-full">Create Event</Button>
        </form>
      </Modal>
    </div>
  );
}
