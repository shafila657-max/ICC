import { supabase, isSupabaseConfigured } from "./client";
import {
  PROGRAMS,
  EVENTS,
  TESTIMONIALS,
  GALLERY_ITEMS,
  COURSES,
  ANNOUNCEMENTS,
  DONATIONS,
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
    if (error) {
      console.warn("fetchPrograms Supabase error:", error.message);
      return PROGRAMS;
    }
    return data && data.length > 0 ? (data as Program[]) : PROGRAMS;
  } catch (err) {
    console.warn("fetchPrograms exception:", err);
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
    if (error) {
      console.warn("fetchEvents Supabase error:", error.message);
      return EVENTS;
    }
    return data && data.length > 0 ? (data as EventItem[]) : EVENTS;
  } catch (err) {
    console.warn("fetchEvents exception:", err);
    return EVENTS;
  }
}

/** Fetch testimonials */
export async function fetchTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) return TESTIMONIALS;
  try {
    const { data, error } = await supabase.from("testimonials").select("*");
    if (error) {
      console.warn("fetchTestimonials Supabase error:", error.message);
      return TESTIMONIALS;
    }
    return data && data.length > 0 ? (data as Testimonial[]) : TESTIMONIALS;
  } catch (err) {
    console.warn("fetchTestimonials exception:", err);
    return TESTIMONIALS;
  }
}

/** Fetch gallery items */
export async function fetchGalleryItems(): Promise<GalleryItem[]> {
  if (!isSupabaseConfigured()) return GALLERY_ITEMS;
  try {
    const { data, error } = await supabase.from("gallery_items").select("*");
    if (error) {
      console.warn("fetchGalleryItems Supabase error:", error.message);
      return GALLERY_ITEMS;
    }
    return data && data.length > 0 ? (data as GalleryItem[]) : GALLERY_ITEMS;
  } catch (err) {
    console.warn("fetchGalleryItems exception:", err);
    return GALLERY_ITEMS;
  }
}

/** Fetch student courses */
export async function fetchCourses(): Promise<Course[]> {
  if (!isSupabaseConfigured()) return COURSES;
  try {
    const { data, error } = await supabase.from("courses").select("*");
    if (error) {
      console.warn("fetchCourses Supabase error:", error.message);
      return COURSES;
    }
    return data && data.length > 0 ? (data as Course[]) : COURSES;
  } catch (err) {
    console.warn("fetchCourses exception:", err);
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
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      console.warn("fetchAnnouncements falling back to constants:", error?.message);
      return ANNOUNCEMENTS.filter(
        (a) => a.target_role === "all" || a.target_role === role
      ) as Announcement[];
    }
    return data.filter(
      (a) => a.target_role === "all" || a.target_role === role
    ) as Announcement[];
  } catch (err) {
    console.warn("fetchAnnouncements exception:", err);
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
    if (error) {
      console.warn("fetchDonations Supabase error:", error.message);
      return DONATIONS;
    }
    return data && data.length > 0 ? (data as Donation[]) : DONATIONS;
  } catch (err) {
    console.warn("fetchDonations exception:", err);
    return DONATIONS;
  }
}

/** Fetch user profiles for Admin Dashboard */
export async function fetchUserProfiles(): Promise<Profile[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase.from("profiles").select("*");
    if (error) {
      console.warn("fetchUserProfiles Supabase error:", error.message);
      return [];
    }
    return (data as Profile[]) || [];
  } catch (err) {
    console.warn("fetchUserProfiles exception:", err);
    return [];
  }
}

/* =============================================
 * MUTATION SERVICES (CREATE, UPDATE, DELETE)
 * ============================================= */

/** Record a new donation */
export async function recordDonation(donation: Partial<Donation>): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from("donations").insert([donation]);
    if (error) {
      console.error("recordDonation error:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error("recordDonation exception:", err);
    return { success: false, error: err.message || "Failed to record donation" };
  }
}

/** Submit event RSVP registration */
export async function submitEventRSVP(rsvp: { event_id: string; name: string; email: string }): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from("event_registrations").insert([rsvp]);
    if (error) {
      console.error("submitEventRSVP error:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error("submitEventRSVP exception:", err);
    return { success: false, error: err.message || "Failed to submit RSVP" };
  }
}

/** Submit contact message */
export async function submitContactMessage(msg: { name: string; email: string; subject?: string; message: string }): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from("contact_messages").insert([msg]);
    if (error) {
      console.error("submitContactMessage error:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error("submitContactMessage exception:", err);
    return { success: false, error: err.message || "Failed to send message" };
  }
}

/** Create Announcement (Admin) */
export async function createAnnouncement(announcement: {
  title: string;
  content: string;
  priority: "low" | "medium" | "high";
  target_role: string;
}): Promise<{ success: boolean; data?: Announcement; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { data, error } = await supabase
      .from("announcements")
      .insert([{
        title: announcement.title,
        content: announcement.content,
        priority: announcement.priority,
        target_role: announcement.target_role,
        is_published: true,
      }])
      .select()
      .single();

    if (error) {
      console.error("createAnnouncement error:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data: data as Announcement };
  } catch (err: any) {
    console.error("createAnnouncement exception:", err);
    return { success: false, error: err.message };
  }
}

/** Delete Announcement (Admin) */
export async function deleteAnnouncement(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) {
      console.error("deleteAnnouncement error:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error("deleteAnnouncement exception:", err);
    return { success: false, error: err.message };
  }
}

/** Create Event (Admin) */
export async function createEvent(event: {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
}): Promise<{ success: boolean; data?: EventItem; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { data, error } = await supabase
      .from("events")
      .insert([{
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        is_featured: false,
      }])
      .select()
      .single();

    if (error) {
      console.error("createEvent error:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data: data as EventItem };
  } catch (err: any) {
    console.error("createEvent exception:", err);
    return { success: false, error: err.message };
  }
}

/** Delete Event (Admin) */
export async function deleteEvent(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) {
      console.error("deleteEvent error:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error("deleteEvent exception:", err);
    return { success: false, error: err.message };
  }
}

/** Create Gallery Item (Admin) */
export async function createGalleryItem(item: {
  title: string;
  category: string;
  image_url?: string;
}): Promise<{ success: boolean; data?: GalleryItem; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { data, error } = await supabase
      .from("gallery_items")
      .insert([{
        title: item.title,
        category: item.category,
        image_url: item.image_url || "/gallery/iftar.jpg",
      }])
      .select()
      .single();

    if (error) {
      console.error("createGalleryItem error:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data: data as GalleryItem };
  } catch (err: any) {
    console.error("createGalleryItem exception:", err);
    return { success: false, error: err.message };
  }
}

/** Delete Gallery Item (Admin) */
export async function deleteGalleryItem(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from("gallery_items").delete().eq("id", id);
    if (error) {
      console.error("deleteGalleryItem error:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error("deleteGalleryItem exception:", err);
    return { success: false, error: err.message };
  }
}

/** Create Profile / User (Admin) */
export async function createUserProfile(profile: {
  full_name: string;
  email: string;
  role: UserRole;
}): Promise<{ success: boolean; data?: Profile; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { data, error } = await supabase
      .from("profiles")
      .insert([{
        full_name: profile.full_name,
        email: profile.email,
        role: profile.role,
        is_active: true,
      }])
      .select()
      .single();

    if (error) {
      console.error("createUserProfile error:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data: data as Profile };
  } catch (err: any) {
    console.error("createUserProfile exception:", err);
    return { success: false, error: err.message };
  }
}

/** Update User Role (Admin) */
export async function updateUserRole(userId: string, role: UserRole): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from("profiles").update({ role }).eq("id", userId);
    if (error) {
      console.error("updateUserRole error:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error("updateUserRole exception:", err);
    return { success: false, error: err.message };
  }
}

/** Delete User Profile (Admin) */
export async function deleteUserProfile(userId: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from("profiles").delete().eq("id", userId);
    if (error) {
      console.error("deleteUserProfile error:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error("deleteUserProfile exception:", err);
    return { success: false, error: err.message };
  }
}
