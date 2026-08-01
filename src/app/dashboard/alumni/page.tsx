"use client";

import React, { useState } from "react";
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
  Filter,
  ArrowUpRight,
} from "lucide-react";
import {
  Card,
  Badge,
  Button,
  Avatar,
  Textarea,
  Input,
} from "@/components/ui";

const ALUMNI_DIRECTORY = [
  { id: "1", name: "Yusuf Ahmed", batch: "2020", degree: "Islamic Studies", location: "Chicago, IL", profession: "Teacher", status: "Mentoring" },
  { id: "2", name: "Sarah Ibrahim", batch: "2019", degree: "Arabic Language", location: "Houston, TX", profession: "Translator", status: "Available" },
  { id: "3", name: "Ali Muhammad", batch: "2021", degree: "Quranic Sciences", location: "New York, NY", profession: "Imam", status: "Mentoring" },
  { id: "4", name: "Khadijah Noor", batch: "2018", degree: "Community Leadership", location: "Los Angeles, CA", profession: "Social Worker", status: "Available" },
  { id: "5", name: "Hassan Malik", batch: "2022", degree: "Islamic Finance", location: "Dallas, TX", profession: "Financial Advisor", status: "Available" },
  { id: "6", name: "Amina Rashid", batch: "2020", degree: "Education", location: "Detroit, MI", profession: "Principal", status: "Mentoring" },
];

const COMMUNITY_POSTS = [
  { id: "1", author: "Yusuf Ahmed", content: "Just completed my Master's in Islamic Pedagogy. Grateful for the foundation ICC gave me. Looking forward to giving back through the mentorship program! 🎓", time: "2 hours ago", likes: 24, comments: 8 },
  { id: "2", author: "Khadijah Noor", content: "Our alumni group in Los Angeles organized a community iftar last weekend. 200+ attendees! ICC alumni are making a difference everywhere. ❤️", time: "1 day ago", likes: 45, comments: 12 },
  { id: "3", author: "Ali Muhammad", content: "Honored to be appointed as the lead Imam at the new community center. None of this would be possible without ICC's Quranic Sciences program.", time: "3 days ago", likes: 67, comments: 15 },
];

const ALUMNI_STATS = [
  { label: "Total Alumni", value: "856", icon: Users, color: "from-emerald-500 to-emerald-600" },
  { label: "Cities", value: "45", icon: Globe, color: "from-blue-500 to-blue-600" },
  { label: "Mentors", value: "120", icon: GraduationCap, color: "from-purple-500 to-purple-600" },
  { label: "Industries", value: "30+", icon: Briefcase, color: "from-gold-500 to-gold-600" },
];

export default function AlumniDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [newPost, setNewPost] = useState("");
  const [filterBatch, setFilterBatch] = useState("all");

  const filteredAlumni = ALUMNI_DIRECTORY.filter(
    (a) =>
      (filterBatch === "all" || a.batch === filterBatch) &&
      (a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {ALUMNI_STATS.map((stat) => (
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
        {/* Alumni Directory */}
        <div className="lg:col-span-2">
          <Card id="directory">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h3 className="text-lg font-bold text-sand-900">Alumni Directory</h3>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sand-400" />
                  <input
                    type="text"
                    placeholder="Search alumni..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 rounded-xl border border-sand-200 text-sm w-full focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                  />
                </div>
                <select
                  value={filterBatch}
                  onChange={(e) => setFilterBatch(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-sand-200 text-sm text-sand-600 focus:border-emerald-400 focus:outline-none"
                >
                  <option value="all">All Batches</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                  <option value="2019">2019</option>
                  <option value="2018">2018</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {filteredAlumni.map((alumnus) => (
                <div
                  key={alumnus.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-sand-100 hover:border-emerald-200 hover:shadow-sm transition-all group"
                >
                  <Avatar name={alumnus.name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sand-900 group-hover:text-emerald-700 transition-colors">
                        {alumnus.name}
                      </h4>
                      <Badge variant={alumnus.status === "Mentoring" ? "success" : "default"}>
                        {alumnus.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-sand-500">
                      <span className="flex items-center gap-1">
                        <GraduationCap className="h-3 w-3" />
                        {alumnus.degree} &apos;{alumnus.batch}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {alumnus.profession}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {alumnus.location}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0 hidden sm:flex">
                    Connect
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Community Feed */}
        <div className="space-y-6">
          {/* Post Form */}
          <Card id="community">
            <h3 className="text-lg font-bold text-sand-900 mb-4">
              <MessageSquare className="inline h-5 w-5 text-emerald-600 mr-2" />
              Share an Update
            </h3>
            <div className="space-y-3">
              <Textarea
                placeholder="Share your news, achievements, or thoughts with the alumni community..."
                rows={3}
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <Button size="sm" className="w-full" disabled={!newPost.trim()}>
                <Send className="h-4 w-4" />
                Post Update
              </Button>
            </div>
          </Card>

          {/* Feed */}
          <Card>
            <h3 className="text-lg font-bold text-sand-900 mb-4">Community Feed</h3>
            <div className="space-y-4">
              {COMMUNITY_POSTS.map((post) => (
                <div key={post.id} className="p-4 rounded-xl bg-sand-50 border border-sand-100">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar name={post.author} size="sm" />
                    <div>
                      <p className="font-semibold text-sand-900 text-sm">{post.author}</p>
                      <p className="text-xs text-sand-400">{post.time}</p>
                    </div>
                  </div>
                  <p className="text-sm text-sand-600 leading-relaxed">{post.content}</p>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-sand-100">
                    <button className="flex items-center gap-1 text-xs text-sand-400 hover:text-red-500 transition-colors cursor-pointer">
                      <Heart className="h-3.5 w-3.5" />
                      {post.likes}
                    </button>
                    <button className="flex items-center gap-1 text-xs text-sand-400 hover:text-emerald-600 transition-colors cursor-pointer">
                      <MessageSquare className="h-3.5 w-3.5" />
                      {post.comments}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
