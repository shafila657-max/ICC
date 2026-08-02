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
  AlumniUpdate,
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
export async function fetchPrograms(orgId = "icc"): Promise<Program[]> {
  if (!isSupabaseConfigured()) return (orgId === "icc" || orgId === "all") ? PROGRAMS : [];
  try {
    let query = supabase.from("programs").select("*").order("created_at", { ascending: false });
    if (orgId !== "all") query = query.eq("organization_id", orgId);
    const { data, error } = await query;
    if (error) {
      console.warn("fetchPrograms Supabase error:", error.message);
      return (orgId === "icc" || orgId === "all") ? PROGRAMS : [];
    }
    if (data && data.length > 0) return data as Program[];
    return (orgId === "icc" || orgId === "all") ? PROGRAMS : [];
  } catch (err) {
    console.warn("fetchPrograms exception:", err);
    return (orgId === "icc" || orgId === "all") ? PROGRAMS : [];
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
export async function fetchEvents(orgId = "icc"): Promise<EventItem[]> {
  if (!isSupabaseConfigured()) return (orgId === "icc" || orgId === "all") ? EVENTS : [];
  try {
    let query = supabase.from("events").select("*").order("date", { ascending: true });
    if (orgId !== "all") query = query.eq("organization_id", orgId);
    const { data, error } = await query;
    if (error) {
      console.warn("fetchEvents Supabase error:", error.message);
      return (orgId === "icc" || orgId === "all") ? EVENTS : [];
    }
    if (data && data.length > 0) return data as EventItem[];
    return (orgId === "icc" || orgId === "all") ? EVENTS : [];
  } catch (err) {
    console.warn("fetchEvents exception:", err);
    return (orgId === "icc" || orgId === "all") ? EVENTS : [];
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
export async function fetchGalleryItems(orgId = "icc"): Promise<GalleryItem[]> {
  if (!isSupabaseConfigured()) return (orgId === "icc" || orgId === "all") ? GALLERY_ITEMS : [];
  try {
    let query = supabase.from("gallery_items").select("*").order("created_at", { ascending: false });
    if (orgId !== "all") query = query.eq("organization_id", orgId);
    const { data, error } = await query;
    if (error) {
      console.warn("fetchGalleryItems Supabase error:", error.message);
      return (orgId === "icc" || orgId === "all") ? GALLERY_ITEMS : [];
    }
    if (data && data.length > 0) return data as GalleryItem[];
    return (orgId === "icc" || orgId === "all") ? GALLERY_ITEMS : [];
  } catch (err) {
    console.warn("fetchGalleryItems exception:", err);
    return (orgId === "icc" || orgId === "all") ? GALLERY_ITEMS : [];
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
export async function fetchAnnouncements(role: UserRole | "all" = "all", orgId = "icc"): Promise<Announcement[]> {
  if (!isSupabaseConfigured()) {
    if (orgId !== "icc" && orgId !== "all") return [];
    return ANNOUNCEMENTS.filter(
      (a) => a.target_role === "all" || a.target_role === role
    ) as Announcement[];
  }
  try {
    let query = supabase.from("announcements").select("*").order("created_at", { ascending: false });
    if (orgId !== "all") query = query.eq("organization_id", orgId);
    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      if (orgId !== "icc" && orgId !== "all") return [];
      return ANNOUNCEMENTS.filter(
        (a) => a.target_role === "all" || a.target_role === role
      ) as Announcement[];
    }
    return data.filter(
      (a) => a.target_role === "all" || a.target_role === role
    ) as Announcement[];
  } catch (err) {
    console.warn("fetchAnnouncements exception:", err);
    if (orgId !== "icc" && orgId !== "all") return [];
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

/** Fetch pending user profiles requiring Admin approval */
export async function fetchPendingProfiles(): Promise<Profile[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .or("is_active.eq.false,status.eq.pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("fetchPendingProfiles error:", error.message);
      return [];
    }
    return (data as Profile[]) || [];
  } catch (err) {
    return [];
  }
}

/** Fetch alumni community discussion feed */
export async function fetchAlumniUpdates(): Promise<AlumniUpdate[]> {
  const fallbackUpdates: AlumniUpdate[] = [
    { id: "1", author_id: "1", author_name: "Omar Hassan (Class of 2020)", content: "Excited to share that our alumni mentoring program is kicking off next week! Contact me if you want to mentor young ICC students.", created_at: "2026-03-01" },
    { id: "2", author_id: "2", author_name: "Fatima Al-Sayed (Class of 2018)", content: "We are organizing the Annual Alumni Gala Dinner on August 15th. Mark your calendars!", created_at: "2026-03-10" },
  ];

  if (!isSupabaseConfigured()) return fallbackUpdates;
  try {
    const { data, error } = await supabase.from("alumni_updates").select("*").order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return fallbackUpdates;
    return data as AlumniUpdate[];
  } catch (err) {
    return fallbackUpdates;
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
  organization_id?: "icc" | "acsa" | "asmar";
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
        organization_id: announcement.organization_id || "icc",
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
  organization_id?: "icc" | "acsa" | "asmar";
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
        organization_id: event.organization_id || "icc",
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
  organization_id?: "icc" | "acsa" | "asmar";
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
        organization_id: item.organization_id || "icc",
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
  organization_id?: "icc" | "acsa" | "asmar";
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
        organization_id: program.organization_id || "icc",
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

/* ===== Alumni Updates & Approval Mutations ===== */

export async function createAlumniUpdate(authorName: string, content: string): Promise<{ success: boolean; data?: AlumniUpdate; error?: string }> {
  if (!isSupabaseConfigured()) {
    return {
      success: true,
      data: {
        id: String(Date.now()),
        author_id: "local",
        author_name: authorName,
        content,
        created_at: new Date().toISOString().split("T")[0],
      },
    };
  }
  try {
    const { data, error } = await supabase
      .from("alumni_updates")
      .insert([{ author_name: authorName, content }])
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: data as AlumniUpdate };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function approveUserProfile(userId: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase
      .from("profiles")
      .update({ is_active: true, status: "approved" })
      .eq("id", userId);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function rejectUserProfile(userId: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase
      .from("profiles")
      .update({ is_active: false, status: "rejected" })
      .eq("id", userId);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/* =============================================
 * FOOD RATES & SITE SETTINGS
 * ============================================= */

export interface FoodRate {
  id: string;
  item_name: string;
  per_child_cost: number;
  total_cost: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

const DEFAULT_FOOD_RATES: FoodRate[] = [
  { id: "1", item_name: "രാവിലെ സാധാ ചായ കടി (നാസ്ത)", per_child_cost: 30, total_cost: 4500, sort_order: 1, is_active: true, created_at: "" },
  { id: "2", item_name: "രാവിലെ പൊറോട്ട, ചിക്കൻ", per_child_cost: 45, total_cost: 6750, sort_order: 2, is_active: true, created_at: "" },
  { id: "3", item_name: "ഉച്ചഭക്ഷണം ഫിഷ്കറി, സാധാ ചോറ്", per_child_cost: 33, total_cost: 4950, sort_order: 3, is_active: true, created_at: "" },
  { id: "4", item_name: "ഇറച്ചിക്കറി, സാധാ ചോറ്", per_child_cost: 40, total_cost: 6000, sort_order: 4, is_active: true, created_at: "" },
  { id: "5", item_name: "ചിക്കൻ ഉപ്പേരിച്ചത്, സാധാ ചോറ്", per_child_cost: 55, total_cost: 8250, sort_order: 5, is_active: true, created_at: "" },
  { id: "6", item_name: "ഇറച്ചി വറട്ട്, സാധാ ചോറ്", per_child_cost: 58, total_cost: 8700, sort_order: 6, is_active: true, created_at: "" },
  { id: "7", item_name: "ഇറച്ചിക്കറി, തേങ്ങാചോറ്", per_child_cost: 50, total_cost: 7500, sort_order: 7, is_active: true, created_at: "" },
  { id: "8", item_name: "ബീഫ് ബിരിയാണി", per_child_cost: 85, total_cost: 12750, sort_order: 8, is_active: true, created_at: "" },
  { id: "9", item_name: "ചിക്കൻ ബിരിയാണി", per_child_cost: 80, total_cost: 12000, sort_order: 9, is_active: true, created_at: "" },
  { id: "10", item_name: "മന്തി", per_child_cost: 80, total_cost: 12000, sort_order: 10, is_active: true, created_at: "" },
  { id: "11", item_name: "ബീഫ്, നെയ്ച്ചോറ്", per_child_cost: 75, total_cost: 11250, sort_order: 11, is_active: true, created_at: "" },
  { id: "12", item_name: "ചിക്കൻ, നെയ്ച്ചോറ്", per_child_cost: 70, total_cost: 10500, sort_order: 12, is_active: true, created_at: "" },
  { id: "13", item_name: "വൈകുന്നേരം ചായ, കടി", per_child_cost: 17, total_cost: 2550, sort_order: 13, is_active: true, created_at: "" },
  { id: "14", item_name: "പായസം", per_child_cost: 10, total_cost: 1500, sort_order: 14, is_active: true, created_at: "" },
  { id: "15", item_name: "ഒരു ദിവസത്തെ സാധാ ഭക്ഷണം", per_child_cost: 120, total_cost: 18000, sort_order: 15, is_active: true, created_at: "" },
];

export async function fetchFoodRates(): Promise<FoodRate[]> {
  if (!isSupabaseConfigured()) return DEFAULT_FOOD_RATES;
  try {
    const { data, error } = await supabase
      .from("food_rates")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return DEFAULT_FOOD_RATES;
    return data as FoodRate[];
  } catch {
    return DEFAULT_FOOD_RATES;
  }
}

export async function fetchAllFoodRates(): Promise<FoodRate[]> {
  if (!isSupabaseConfigured()) return DEFAULT_FOOD_RATES;
  try {
    const { data, error } = await supabase
      .from("food_rates")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return DEFAULT_FOOD_RATES;
    return data as FoodRate[];
  } catch {
    return DEFAULT_FOOD_RATES;
  }
}

export async function createFoodRate(rate: { item_name: string; per_child_cost: number; total_cost: number; sort_order?: number }): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from("food_rates").insert([rate]);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateFoodRate(id: string, updates: Partial<FoodRate>): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from("food_rates").update(updates).eq("id", id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteFoodRate(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase.from("food_rates").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function fetchSetting(key: string, fallback = ""): Promise<string> {
  if (!isSupabaseConfigured()) return fallback;
  try {
    const { data, error } = await supabase.from("site_settings").select("value").eq("key", key).single();
    if (error || !data) return fallback;
    return data.value;
  } catch {
    return fallback;
  }
}

export async function updateSetting(key: string, value: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: true };
  try {
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
