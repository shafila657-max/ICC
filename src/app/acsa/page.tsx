import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  Users,
  BookOpen,
  Trophy,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  Send,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container, Badge, Card, Button, Input, Textarea } from "@/components/ui";
import { fetchGalleryItems, fetchEvents, submitContactMessage } from "@/lib/supabase/api";

export const dynamic = "force-dynamic";

export default async function ACSAPage() {
  const galleryItems = await fetchGalleryItems("acsa");
  const eventsData = await fetchEvents("acsa");

  const studentEvents = eventsData.slice(0, 3);
  const studentGallery = galleryItems.slice(0, 4);

  async function handleACSARegistration(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const batch = formData.get("batch") as string;
    const interest = formData.get("interest") as string;

    await submitContactMessage({
      name,
      email,
      subject: `ACSA Student Member Registration: ${batch}`,
      message: `Phone: ${phone}\nBatch/Grade: ${batch}\nInterests: ${interest}`,
    });
  }

  return (
    <div className="min-h-screen bg-sand-50 flex flex-col">
      <Navbar />

      <main className="flex-1 pb-16">
        {/* ACSA Hero Banner */}
        <section className="relative bg-gradient-to-br from-emerald-950 via-emerald-900 to-sand-900 text-white pt-32 pb-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />

          <Container className="relative z-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-emerald-200 hover:text-white transition-colors text-sm font-medium mb-8 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Back to ICC Main Portal
            </Link>

            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <Badge variant="gold" className="mb-4 text-xs uppercase tracking-widest font-bold">
                  <GraduationCap className="h-4 w-4 mr-1.5" /> Student Body Portal
                </Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
                  ACSA — Al-Hidayah Center Students Association
                </h1>
                <p className="text-lg text-emerald-100/90 leading-relaxed mb-8 max-w-2xl">
                  Empowering current students through leadership development, academic excellence, Islamic brotherhood, and vibrant campus life.
                </p>

                <div className="flex flex-wrap gap-4">
                  <a href="#register">
                    <Button variant="gold" size="lg" className="font-bold">
                      <Users className="h-5 w-5 mr-2" /> Join ACSA Student Union
                    </Button>
                  </a>
                  <a href="#activities">
                    <Button variant="outline" size="lg" className="text-white border-white/30 hover:bg-white/10">
                      View Student Activities
                    </Button>
                  </a>
                </div>
              </div>

              {/* Stats */}
              <div className="lg:col-span-4 grid grid-cols-2 gap-4">
                {[
                  { label: "Active Students", val: "1,200+" },
                  { label: "Student Clubs", val: "15+" },
                  { label: "Annual Events", val: "45+" },
                  { label: "Mentors", val: "30+" },
                ].map((st, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
                    <p className="text-2xl font-extrabold text-gold-400">{st.val}</p>
                    <p className="text-xs text-emerald-200 mt-1 font-medium">{st.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Pillars of ACSA */}
        <section className="py-16 bg-white border-b border-sand-200">
          <Container>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <Badge variant="success" className="mb-2">Core Mission</Badge>
              <h2 className="text-3xl font-extrabold text-sand-900">What ACSA Stands For</h2>
              <p className="text-sand-500 text-sm mt-2">Nurturing holistic development for tomorrow’s leaders</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { title: "Academic Rigor", desc: "Peer tutoring, study circles, and merit scholarships for outstanding students.", icon: BookOpen, color: "text-blue-600 bg-blue-50" },
                { title: "Islamic Values", desc: "Weekly halaqas, Quran memorization, and spiritual retreats.", icon: Sparkles, color: "text-emerald-600 bg-emerald-50" },
                { title: "Leadership Councils", desc: "Student cabinet elections, debate tournaments, and event planning.", icon: Trophy, color: "text-gold-600 bg-gold-50" },
                { title: "Community Service", desc: "Volunteering, food drives, and local neighborhood outreach.", icon: Users, color: "text-purple-600 bg-purple-50" },
              ].map((pil, idx) => (
                <Card key={idx} className="p-6 text-center hover:shadow-lg transition-all">
                  <div className={`h-12 w-12 rounded-2xl mx-auto flex items-center justify-center mb-4 ${pil.color}`}>
                    <pil.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-sand-900 mb-2">{pil.title}</h3>
                  <p className="text-xs text-sand-500 leading-relaxed">{pil.desc}</p>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* Student Activities Section */}
        <section id="activities" className="py-16">
          <Container>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
              <div>
                <Badge variant="gold" className="mb-2">Student Life</Badge>
                <h2 className="text-3xl font-extrabold text-sand-900">Upcoming ACSA Activities</h2>
              </div>
              <Link href="/#events">
                <Button variant="outline" size="sm">View All Campus Events</Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {studentEvents.map((ev) => (
                <Card key={ev.id} className="p-6 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-sand-500">{ev.date}</p>
                      <p className="text-xs text-sand-400">{ev.time}</p>
                    </div>
                  </div>
                  <h3 className="font-bold text-sand-900 text-lg mb-2">{ev.title}</h3>
                  <p className="text-xs text-sand-500 line-clamp-2 mb-4">{ev.description}</p>
                  <div className="pt-3 border-t border-sand-100 flex items-center justify-between">
                    <span className="text-[10px] text-sand-400">📍 {ev.location}</span>
                    <Badge variant="success">ACSA Event</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* ACSA Student Gallery */}
        <section className="py-16 bg-white border-y border-sand-200">
          <Container>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <Badge variant="success" className="mb-2">Campus Moments</Badge>
              <h2 className="text-3xl font-extrabold text-sand-900">ACSA Life & Gallery</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {studentGallery.map((item) => (
                <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-sand-200 bg-sand-100">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-emerald-50">
                      <ImageIcon className="h-8 w-8 text-emerald-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex items-end">
                    <p className="text-white text-xs font-bold">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ACSA Student Registration Form */}
        <section id="register" className="py-16">
          <Container>
            <div className="max-w-2xl mx-auto">
              <Card className="p-8 border-2 border-emerald-500/30 shadow-xl bg-white">
                <div className="text-center mb-8">
                  <Badge variant="gold" className="mb-2">Student Membership</Badge>
                  <h2 className="text-2xl font-extrabold text-sand-900">Register for ACSA Membership</h2>
                  <p className="text-xs text-sand-500 mt-1">Join the official ICC student association to access clubs, mentorship, and leadership roles.</p>
                </div>

                <form action={handleACSARegistration} className="space-y-4">
                  <Input label="Full Name" name="name" placeholder="Student name" required />
                  <Input label="Email Address" type="email" name="email" placeholder="student@icc.org" required />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Phone Number" type="tel" name="phone" placeholder="+1 (555) 000-0000" />
                    <Input label="Batch / Grade" name="batch" placeholder="e.g. Batch 2026 / Class 12" required />
                  </div>
                  <Textarea label="Areas of Interest (Debates, Sports, Quran, Clubs)" name="interest" rows={3} placeholder="Tell us what student clubs you want to join..." />

                  <Button type="submit" className="w-full font-bold py-3">
                    <Send className="h-4 w-4 mr-2" /> Complete ACSA Registration
                  </Button>
                </form>
              </Card>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
