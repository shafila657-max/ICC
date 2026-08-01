import { supabase, isSupabaseConfigured } from "./client";
import {
  PROGRAMS,
  EVENTS,
  TESTIMONIALS,
  GALLERY_ITEMS,
  COURSES,
  ANNOUNCEMENTS,
  DONATIONS,
  STATS,
} from "@/lib/constants";
import type {
  Program,
  Event as EventItem,
  Testimonial,
  GalleryItem,
  Course,
  Announcement,
  Donation,
  UserRole,
  Profile,
} from "@/lib/types";

/* =============================================
 * READ SERVICES (With Seed Data Fallbacks)
 * ============================================= */

/** Fetch active programs */
export async function fetchPrograms(): Promise<Program[]> {
  if (!isSupabaseConfigured()) return PROGRAMS;
  try {
    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .eq("is_active", true);
    if (error || !data || data.length === 0) return PROGRAMS;
    return data as Program[];
  } catch {
    return PROGRAMS;
  }
}

/** Fetch upcoming events */
export async function fetchEvents(): Promise<EventItem[]> {
  if (!isSupabaseConfigured()) return EVENTS;
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });
    if (error || !data || data.length === 0) return EVENTS;
    return data as EventItem[];
  } catch {
    return EVENTS;
  }
}

/** Fetch testimonials */
export async function fetchTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) return TESTIMONIALS;
  try {
    const { data, error } = await supabase.from("testimonials").select("*");
    if (error || !data || data.length === 0) return TESTIMONIALS;
    return data as Testimonial[];
  } catch {
    return TESTIMONIALS;
  }
}

/** Fetch gallery items */
export async function fetchGalleryItems(): Promise<GalleryItem[]> {
  if (!isSupabaseConfigured()) return GALLERY_ITEMS;
  try {
    const { data, error } = await supabase.from("gallery_items").select("*");
    if (error || !data || data.length === 0) return GALLERY_ITEMS;
    return data as GalleryItem[];
  } catch {
    return GALLERY_ITEMS;
  }
}

/** Fetch student courses */
export async function fetchCourses(): Promise<Course[]> {
  if (!isSupabaseConfigured()) return COURSES;
  try {
    const { data, error } = await supabase.from("courses").select("*");
    if (error || !data || data.length === 0) return COURSES;
    return data as Course[];
  } catch {
    return COURSES;
  }
}

/** Fetch published announcements for specific target role */
export async function fetchAnnouncements(role: UserRole | "all" = "all"): Promise<Announcement[]> {
  if (!isSupabaseConfigured()) {
    return ANNOUNCEMENTS.filter(
      (a) => a.target_role === "all" || a.target_role === role
    ) as Announcement[];
  }
  try {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("is_published", true);
    if (error || !data || data.length === 0) {
      return ANNOUNCEMENTS.filter(
        (a) => a.target_role === "all" || a.target_role === role
      ) as Announcement[];
    }
    return data.filter(
      (a) => a.target_role === "all" || a.target_role === role
    ) as Announcement[];
  } catch {
    return ANNOUNCEMENTS as Announcement[];
  }
}

/** Fetch donations list */
export async function fetchDonations(): Promise<Donation[]> {
  if (!isSupabaseConfigured()) return DONATIONS;
  try {
    const { data, error } = await supabase
      .from("donations")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return DONATIONS;
    return data as Donation[];
  } catch {
    return DONATIONS;
  }
}

/** Fetch user profiles for Admin Dashboard */
export async function fetchUserProfiles(): Promise<Profile[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase.from("profiles").select("*");
    if (error || !data) return [];
    return data as Profile[];
  } catch {
    return [];
  }
}

/* =============================================
 * MUTATION SERVICES
 * ============================================= */

/** Record a new donation */
export async function recordDonation(donation: Partial<Donation>): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from("donations").insert([donation]);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to record donation" };
  }
}

/** Submit event RSVP registration */
export async function submitEventRSVP(rsvp: { event_id: string; name: string; email: string }): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from("event_registrations").insert([rsvp]);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to submit RSVP" };
  }
}

/** Submit contact message */
export async function submitContactMessage(msg: { name: string; email: string; subject?: string; message: string }): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from("contact_messages").insert([msg]);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to send message" };
  }
}

/** Create Announcement (Admin) */
export async function createAnnouncement(announcement: Partial<Announcement>): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from("announcements").insert([announcement]);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/** Create Event (Admin) */
export async function createEvent(event: Partial<EventItem>): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from("events").insert([event]);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/** Update User Role (Admin) */
export async function updateUserRole(userId: string, role: UserRole): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from("profiles").update({ role }).eq("id", userId);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
