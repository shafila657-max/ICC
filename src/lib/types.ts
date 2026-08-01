export type UserRole = "admin" | "student" | "alumni";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  graduation_year?: number;
  batch?: string;
  is_active?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Program {
  id: string;
  title: string;
  description: string;
  category: "education" | "relief" | "youth" | "quran";
  image_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image_url?: string;
  is_featured: boolean;
  max_attendees?: number;
  created_at: string;
}

export type EventItem = Event;

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: "low" | "medium" | "high";
  target_role: UserRole | "all";
  is_published: boolean;
  author_id: string;
  created_at: string;
}

export interface Donation {
  id: string;
  donor_name: string;
  donor_email: string;
  amount: number;
  category: "zakat" | "sadaqah" | "fitrah" | "general";
  message?: string;
  is_anonymous: boolean;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  category: string;
  description?: string;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  schedule: string;
  progress?: number;
  materials_url?: string;
  created_at: string;
}

export interface AlumniUpdate {
  id: string;
  author_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

export interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar?: string;
  rating: number;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}
