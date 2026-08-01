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
 * STORAGE SERVICES
 * ============================================= */

/**
 * Upload an image file directly to Supabase Storage and return its public URL
 */
export async function uploadImageToSupabase(
  file: File,
  bucketName = "gallery"
): Promise<{ success: boolean; url?: string; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: true, url: URL.createObjectURL(file) };
  }

  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload to Supabase Storage Bucket
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase Storage Upload Error:", uploadError.message);
      return { success: false, error: uploadError.message };
    }

    // Retrieve Public URL
    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);

    return { success: true, url: data.publicUrl };
  } catch (err: any) {
    console.error("Storage upload exception:", err);
    return { success: false, error: err.message || "Failed to upload image file" };
  }
}

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
      .order("created_at", { ascending: false });
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

/** Fetch single program by ID */
export async function fetchProgramById(id: string): Promise<Program | null> {
  if (!isSupabaseConfigured()) {
    return PROGRAMS.find((p) => p.id === id) || null;
  }
  try {
    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !data) {
      return PROGRAMS.find((p) => p.id === id) || null;
    }
    return data as Program;
  } catch (err) {
    return PROGRAMS.find((p) => p.id === id) || null;
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
    const { data, error } = await supabase.from("gallery_items").select("*").order("created_at", { ascending: false });
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
    const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
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

/* ===== Announcement Mutations ===== */

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

    if (error) return { success: false, error: error.message };
    return { success: true, data: data as Announcement };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateAnnouncement(
  id: string,
  announcement: Partial<Announcement>
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase
      .from("announcements")
      .update(announcement)
      .eq("id", id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteAnnouncement(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/* ===== Event Mutations ===== */

export async function createEvent(event: {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image_url?: string;
  is_featured?: boolean;
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
        image_url: event.image_url,
        is_featured: event.is_featured ?? false,
      }])
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: data as EventItem };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateEvent(
  id: string,
  event: Partial<EventItem>
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase
      .from("events")
      .update(event)
      .eq("id", id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteEvent(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/* ===== Gallery Mutations ===== */

export async function createGalleryItem(item: {
  title: string;
  category: string;
  image_url: string;
  description?: string;
}): Promise<{ success: boolean; data?: GalleryItem; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { data, error } = await supabase
      .from("gallery_items")
      .insert([{
        title: item.title,
        category: item.category,
        image_url: item.image_url,
        description: item.description,
      }])
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: data as GalleryItem };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateGalleryItem(
  id: string,
  item: Partial<GalleryItem>
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from("gallery_items").update(item).eq("id", id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteGalleryItem(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from("gallery_items").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/* ===== User Profile Mutations ===== */

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

    if (error) return { success: false, error: error.message };
    return { success: true, data: data as Profile };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateUserProfile(
  userId: string,
  profile: Partial<Profile>
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from("profiles").update(profile).eq("id", userId);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateUserRole(userId: string, role: UserRole): Promise<{ success: boolean; error?: string }> {
  return updateUserProfile(userId, { role });
}

export async function deleteUserProfile(userId: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from("profiles").delete().eq("id", userId);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/* ===== Program Mutations ===== */

export async function createProgram(program: {
  title: string;
  description: string;
  category: "education" | "relief" | "youth" | "quran";
  image_url?: string;
  full_content?: string;
  features?: string[];
  schedule?: string;
  contact_email?: string;
  cta_text?: string;
}): Promise<{ success: boolean; data?: Program; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { data, error } = await supabase
      .from("programs")
      .insert([{
        title: program.title,
        description: program.description,
        category: program.category,
        image_url: program.image_url,
        full_content: program.full_content || "",
        features: program.features || [],
        schedule: program.schedule || "Flexible Schedule",
        contact_email: program.contact_email || "info@icc.org",
        cta_text: program.cta_text || "Register / Get In Touch",
        is_active: true,
      }])
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: data as Program };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateProgram(
  id: string,
  program: Partial<Program>
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase
      .from("programs")
      .update(program)
      .eq("id", id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteProgram(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from("programs").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
