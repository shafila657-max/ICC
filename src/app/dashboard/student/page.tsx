"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Bell,
  Clock,
  Download,
  Play,
  Calendar,
  Award,
  TrendingUp,
} from "lucide-react";
import { Card, Badge, Button, ProgressBar } from "@/components/ui";
import { COURSES, ANNOUNCEMENTS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { fetchAnnouncements, fetchCourses } from "@/lib/supabase/api";
import type { Announcement, Course } from "@/lib/types";

const STUDENT_STATS = [
  { label: "Enrolled Courses", value: "4", icon: BookOpen, color: "from-emerald-500 to-emerald-600" },
  { label: "Completed", value: "2", icon: Award, color: "from-gold-500 to-gold-600" },
  { label: "Study Hours", value: "128", icon: Clock, color: "from-blue-500 to-blue-600" },
  { label: "Avg Score", value: "92%", icon: TrendingUp, color: "from-purple-500 to-purple-600" },
];

const SCHEDULE = [
  { time: "6:00 PM", course: "Tajweed Fundamentals", day: "Today", status: "upcoming" },
  { time: "5:00 PM", course: "Arabic Language I", day: "Tomorrow", status: "upcoming" },
  { time: "10:00 AM", course: "Islamic History", day: "Saturday", status: "upcoming" },
  { time: "2:00 PM", course: "Fiqh of Worship", day: "Sunday", status: "upcoming" },
];

export default function StudentDashboard() {
  const [coursesList, setCoursesList] = useState<Course[]>(COURSES as Course[]);
  const [announcementsList, setAnnouncementsList] = useState<Announcement[]>(ANNOUNCEMENTS as Announcement[]);

  useEffect(() => {
    async function loadStudentData() {
      const dbCourses = await fetchCourses();
      if (dbCourses.length > 0) setCoursesList(dbCourses);

      const dbAnn = await fetchAnnouncements("student");
      if (dbAnn.length > 0) setAnnouncementsList(dbAnn);
    }
    loadStudentData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STUDENT_STATS.map((stat) => (
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
        {/* Courses */}
        <div className="lg:col-span-2 space-y-6">
          <Card id="courses">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-sand-900">My Courses</h3>
              <Badge variant="success">{coursesList.length} Enrolled</Badge>
            </div>

            <div className="space-y-4">
              {coursesList.map((course) => (
                <div
                  key={course.id}
                  className="p-4 rounded-xl border border-sand-100 hover:border-emerald-200 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-200 transition-colors">
                      <BookOpen className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sand-900 group-hover:text-emerald-700 transition-colors">
                          {course.title}
                        </h4>
                        <Badge variant={(course.progress || 0) >= 70 ? "success" : "default"}>
                          {course.progress || 0}%
                        </Badge>
                      </div>
                      <p className="text-sm text-sand-500 mb-2">{course.description}</p>
                      <div className="flex items-center gap-4 text-xs text-sand-400 mb-3">
                        <span>👨‍🏫 {course.instructor}</span>
                        <span>🕐 {course.schedule}</span>
                      </div>
                      <ProgressBar value={course.progress || 0} />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 pl-16">
                    <Button variant="secondary" size="sm">
                      <Play className="h-3 w-3" /> Continue
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-3 w-3" /> Materials
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Schedule */}
          <Card>
            <h3 className="text-lg font-bold text-sand-900 mb-4">
              <Calendar className="inline h-5 w-5 text-emerald-600 mr-2" />
              Upcoming Classes
            </h3>
            <div className="space-y-3">
              {SCHEDULE.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl bg-sand-50 hover:bg-emerald-50 transition-colors"
                >
                  <div className="text-center min-w-[50px]">
                    <p className="text-xs text-sand-400">{item.day}</p>
                    <p className="text-sm font-bold text-sand-700">{item.time}</p>
                  </div>
                  <div className="h-8 w-px bg-emerald-200" />
                  <p className="text-sm font-medium text-sand-700 flex-1">{item.course}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Announcements */}
          <Card id="announcements">
            <h3 className="text-lg font-bold text-sand-900 mb-4">
              <Bell className="inline h-5 w-5 text-gold-500 mr-2" />
              Announcements
            </h3>
            <div className="space-y-3">
              {announcementsList.map((ann) => (
                <div
                  key={ann.id}
                  className={`p-3 rounded-xl border-l-4 ${
                    ann.priority === "high"
                      ? "border-l-red-400 bg-red-50/50"
                      : ann.priority === "medium"
                      ? "border-l-amber-400 bg-amber-50/50"
                      : "border-l-blue-400 bg-blue-50/50"
                  }`}
                >
                  <h4 className="font-semibold text-sm text-sand-900">{ann.title}</h4>
                  <p className="text-xs text-sand-500 mt-1 line-clamp-2">{ann.content}</p>
                  <p className="text-xs text-sand-400 mt-2">{formatDate(ann.created_at)}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
