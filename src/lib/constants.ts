import type { Program, Event, Testimonial, Course, GalleryItem, Announcement, Donation } from "./types";

/* ===== Programs ===== */
export const PROGRAMS: Program[] = [
  {
    id: "1",
    title: "Quranic Studies",
    description: "Comprehensive Quran memorization and Tajweed classes for all ages with certified scholars.",
    category: "quran",
    is_active: true,
    created_at: "2024-01-15",
  },
  {
    id: "2",
    title: "Youth Leadership",
    description: "Empowering young Muslims with leadership skills, Islamic values, and community service.",
    category: "youth",
    is_active: true,
    created_at: "2024-02-01",
  },
  {
    id: "3",
    title: "Community Outreach",
    description: "General community outreach and support programs.",
    category: "education",
    is_active: true,
    created_at: "2024-03-10",
  },
  {
    id: "4",
    title: "Islamic Education",
    description: "Weekend Islamic school covering Fiqh, Seerah, Arabic language, and Islamic history.",
    category: "education",
    is_active: true,
    created_at: "2024-04-01",
  },
  {
    id: "5",
    title: "Women's Circle",
    description: "Weekly halaqah, mentorship programs, and empowerment workshops for sisters.",
    category: "education",
    is_active: true,
    created_at: "2024-05-01",
  },
  {
    id: "6",
    title: "Refugee Support",
    description: "Integration assistance, language classes, and employment support for refugee families.",
    category: "relief",
    is_active: true,
    created_at: "2024-06-01",
  },
];

/* ===== Events ===== */
export const EVENTS: Event[] = [
  {
    id: "1",
    title: "Annual Iftar Gathering",
    description: "Join us for a blessed evening of community iftar, Quran recitation, and inspiring talk by Sheikh Ahmad.",
    date: "2026-03-15",
    time: "6:00 PM",
    location: "ICC Main Hall",
    is_featured: true,
    max_attendees: 500,
    created_at: "2024-01-01",
  },
  {
    id: "2",
    title: "Islamic Art Exhibition",
    description: "Explore beautiful Islamic calligraphy, geometric art, and cultural exhibitions from local artists.",
    date: "2026-04-20",
    time: "10:00 AM",
    location: "Community Center",
    is_featured: true,
    max_attendees: 200,
    created_at: "2024-02-01",
  },
  {
    id: "3",
    title: "Youth Summer Camp",
    description: "A week-long immersive program combining Islamic learning, outdoor activities, and team building.",
    date: "2026-07-01",
    time: "9:00 AM",
    location: "ICC Campus",
    is_featured: false,
    max_attendees: 100,
    created_at: "2024-03-01",
  },
  {
    id: "4",
    title: "Charity Gala Dinner",
    description: "Elegant fundraising dinner supporting our education and relief programs worldwide.",
    date: "2026-09-10",
    time: "7:00 PM",
    location: "Grand Ballroom",
    is_featured: true,
    max_attendees: 300,
    created_at: "2024-04-01",
  },
];

/* ===== Testimonials ===== */
export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Aisha Rahman",
    role: "Student",
    content: "The Quranic studies program transformed my understanding of the Quran. The teachers are incredibly patient and knowledgeable. I've memorized 10 Juz in just one year!",
    rating: 5,
  },
  {
    name: "Omar Hassan",
    role: "Donor",
    content: "I trust ICC with my Zakat contributions because of their transparency and impact. They've helped hundreds of families in our community and abroad.",
    rating: 5,
  },
  {
    name: "Fatima Al-Sayed",
    role: "Alumni",
    content: "ICC's youth leadership program gave me the confidence and skills I needed. Now I'm leading community initiatives and mentoring the next generation.",
    rating: 5,
  },
  {
    name: "Ibrahim Khalil",
    role: "Parent",
    content: "My children love the weekend Islamic school. The curriculum is engaging, modern, and firmly rooted in authentic scholarship. Highly recommended!",
    rating: 5,
  },
  {
    name: "Mariam Yusuf",
    role: "Volunteer",
    content: "Volunteering at ICC's refugee program has been the most rewarding experience. The team is dedicated and the impact is truly life-changing.",
    rating: 5,
  },
];

/* ===== Gallery ===== */
export const GALLERY_ITEMS: GalleryItem[] = [
  { id: "1", title: "Annual Iftar 2025", image_url: "/gallery/iftar.jpg", category: "Events", created_at: "2025-03-20" },
  { id: "2", title: "Quran Competition", image_url: "/gallery/quran.jpg", category: "Education", created_at: "2025-04-15" },
  { id: "3", title: "Youth Camp", image_url: "/gallery/camp.jpg", category: "Youth", created_at: "2025-07-10" },
  { id: "4", title: "Community Service", image_url: "/gallery/service.jpg", category: "Community", created_at: "2025-08-05" },
  { id: "5", title: "Eid Celebration", image_url: "/gallery/eid.jpg", category: "Events", created_at: "2025-06-15" },
  { id: "6", title: "Charity Drive", image_url: "/gallery/charity.jpg", category: "Community", created_at: "2025-09-01" },
  { id: "7", title: "Islamic Calligraphy", image_url: "/gallery/calligraphy.jpg", category: "Art", created_at: "2025-10-12" },
  { id: "8", title: "Sisters Halaqah", image_url: "/gallery/halaqah.jpg", category: "Education", created_at: "2025-11-03" },
];

/* ===== Courses ===== */
export const COURSES: Course[] = [
  { id: "1", title: "Tajweed Fundamentals", description: "Master the rules of Quran recitation with proper pronunciation.", instructor: "Sheikh Ahmad", schedule: "Mon & Wed, 6–7 PM", progress: 65, created_at: "2024-01-01" },
  { id: "2", title: "Arabic Language I", description: "Beginner Arabic covering reading, writing, and basic conversation.", instructor: "Ustadha Noor", schedule: "Tue & Thu, 5–6 PM", progress: 40, created_at: "2024-01-01" },
  { id: "3", title: "Islamic History", description: "Journey through the golden age of Islam and key historical events.", instructor: "Dr. Yusuf Ali", schedule: "Saturday, 10–12 PM", progress: 80, created_at: "2024-01-01" },
  { id: "4", title: "Fiqh of Worship", description: "Understanding the rulings of prayer, fasting, zakat and hajj.", instructor: "Mufti Bilal", schedule: "Sunday, 2–4 PM", progress: 25, created_at: "2024-01-01" },
];

/* ===== Announcements ===== */
export const ANNOUNCEMENTS: Announcement[] = [
  { id: "1", title: "Ramadan Schedule Update", content: "New Taraweeh prayer times starting from March 1st. Imam Yusuf will lead prayers.", priority: "high", target_role: "all", is_published: true, author_id: "admin1", created_at: "2026-02-20" },
  { id: "2", title: "Scholarship Applications Open", content: "Apply now for the ICC Merit Scholarship for the 2026-2027 academic year. Deadline: April 15th.", priority: "medium", target_role: "student", is_published: true, author_id: "admin1", created_at: "2026-03-01" },
  { id: "3", title: "Alumni Reunion 2026", content: "Save the date! Annual alumni reunion on August 15th. Register through the alumni portal.", priority: "medium", target_role: "alumni", is_published: true, author_id: "admin1", created_at: "2026-03-10" },
  { id: "4", title: "New Library Books", content: "50 new titles added to the ICC library including Tafseer, Seerah, and contemporary Islamic thought.", priority: "low", target_role: "all", is_published: true, author_id: "admin1", created_at: "2026-03-15" },
];

/* ===== Donations ===== */
export const DONATIONS: Donation[] = [
  { id: "2", donor_name: "Ahmed Khan", donor_email: "ahmed@email.com", amount: 1000, category: "sadaqah", message: "For the youth program", is_anonymous: false, created_at: "2026-02-01" },
  { id: "3", donor_name: "Zainab Ali", donor_email: "zainab@email.com", amount: 2500, category: "general", is_anonymous: false, created_at: "2026-02-20" },
];

/* ===== Stats ===== */
export const STATS = [
  { label: "Students Enrolled", value: 1200, suffix: "+" },
  { label: "Donations Raised", value: 850, prefix: "$", suffix: "K" },
  { label: "Community Events", value: 340, suffix: "+" },
  { label: "Families Helped", value: 2500, suffix: "+" },
];

/* ===== Navigation ===== */
export const NAV_LINKS = [
  { label: "Home", href: "/#hero" },
  { label: "About", href: "/#about" },
  { label: "Programs", href: "/#programs" },
  { label: "ACSA (Students)", href: "/acsa" },
  { label: "ASMAR (Alumni)", href: "/asmar" },
  { label: "Events", href: "/#events" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Donate", href: "/#donate" },
  { label: "Contact", href: "/contact" },
];

export const DONATION_CATEGORIES = [
  { id: "sadaqah", label: "Sadaqah", description: "Voluntary charitable giving", icon: "Heart" },
  { id: "general", label: "General", description: "Support our programs and operations", icon: "HandHeart" },
  { id: "education", label: "Education Fund", description: "Support student scholarships", icon: "BookOpen" },
  { id: "facility", label: "Facility Fund", description: "Maintain center facilities", icon: "Building" },
] as const;

export const DONATION_PRESETS = [25, 50, 100, 250, 500, 1000];
