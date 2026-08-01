import React from "react";
import Link from "next/link";
import {
  Globe,
  Award,
  Users,
  Briefcase,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  Send,
  ArrowLeft,
  Sparkles,
  Heart,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container, Badge, Card, Button, Input, Textarea } from "@/components/ui";
import { fetchGalleryItems, submitContactMessage } from "@/lib/supabase/api";

export const dynamic = "force-dynamic";

export default async function ASMARPage() {
  const galleryItems = await fetchGalleryItems();
  const alumniGallery = galleryItems.slice(0, 4);

  async function handleASMARRegistration(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const gradYear = formData.get("gradYear") as string;
    const profession = formData.get("profession") as string;

    await submitContactMessage({
      name,
      email,
      subject: `ASMAR Alumni Directory Registration: Class of ${gradYear}`,
      message: `Phone: ${phone}\nGraduation Year: ${gradYear}\nProfession/Location: ${profession}`,
    });
  }

  const alumniSpotlights = [
    { name: "Dr. Tariq Al-Mansoor", batch: "Class of 2018", role: "Chief Medical Fellow", desc: "Leading healthcare research initiatives and providing medical relief to displaced communities.", icon: Award },
    { name: "Zainab Siddiqui", batch: "Class of 2020", role: "AI Research Engineer", desc: "Developing ethical AI technologies and mentoring female STEM students at ICC.", icon: Briefcase },
    { name: "Bilal Hassan", batch: "Class of 2016", role: "Humanitarian Director", desc: "Directing international relief campaigns across North Africa and the Middle East.", icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-sand-50 flex flex-col">
      <Navbar />

      <main className="flex-1 pb-16">
        {/* ASMAR Hero Banner */}
        <section className="relative bg-gradient-to-br from-sand-900 via-emerald-950 to-sand-950 text-white pt-32 pb-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold-500/15 rounded-full blur-3xl" />

          <Container className="relative z-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gold-300 hover:text-white transition-colors text-sm font-medium mb-8 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Back to ICC Main Portal
            </Link>

            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <Badge variant="gold" className="mb-4 text-xs uppercase tracking-widest font-bold">
                  <Globe className="h-4 w-4 mr-1.5" /> Alumni Network Portal
                </Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
                  ASMAR — Alumni Association of ICC
                </h1>
                <p className="text-lg text-sand-200 leading-relaxed mb-8 max-w-2xl">
                  Uniting ICC graduates worldwide. ASMAR fosters lifelong brotherhood, professional career mentoring, legacy endowment projects, and annual grand reunions.
                </p>

                <div className="flex flex-wrap gap-4">
                  <a href="#register">
                    <Button variant="gold" size="lg" className="font-bold">
                      <Sparkles className="h-5 w-5 mr-2" /> Join ASMAR Alumni Network
                    </Button>
                  </a>
                  <a href="#spotlight">
                    <Button variant="outline" size="lg" className="text-white border-white/30 hover:bg-white/10">
                      View Wall of Fame
                    </Button>
                  </a>
                </div>
              </div>

              {/* Stats */}
              <div className="lg:col-span-4 grid grid-cols-2 gap-4">
                {[
                  { label: "Global Alumni", val: "850+" },
                  { label: "Global Chapters", val: "12+" },
                  { label: "Mentorship", val: "100%" },
                  { label: "Annual Reunions", val: "10+" },
                ].map((st, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-gold-500/20 text-center">
                    <p className="text-2xl font-extrabold text-gold-400">{st.val}</p>
                    <p className="text-xs text-sand-300 mt-1 font-medium">{st.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Pillars of ASMAR */}
        <section className="py-16 bg-white border-b border-sand-200">
          <Container>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <Badge variant="gold" className="mb-2">Alumni Vision</Badge>
              <h2 className="text-3xl font-extrabold text-sand-900">Why Join ASMAR?</h2>
              <p className="text-sand-500 text-sm mt-2">Connecting past graduates with future generations</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { title: "Career Directory", desc: "Access the global directory of ICC alumni in tech, medicine, law, and business.", icon: Briefcase, color: "text-gold-600 bg-gold-50" },
                { title: "Student Mentorship", desc: "Guide younger ICC students through university admissions and career choices.", icon: Users, color: "text-emerald-600 bg-emerald-50" },
                { title: "Annual Reunions", desc: "Exclusive invitations to annual galas, banquets, and networking dinners.", icon: Calendar, color: "text-purple-600 bg-purple-50" },
                { title: "Legacy Projects", desc: "Sponsor scholarships and emergency relief initiatives back home.", icon: Heart, color: "text-red-600 bg-red-50" },
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

        {/* Wall of Fame / Alumni Spotlight */}
        <section id="spotlight" className="py-16">
          <Container>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <Badge variant="gold" className="mb-2">Wall of Fame</Badge>
              <h2 className="text-3xl font-extrabold text-sand-900">Alumni Spotlight</h2>
              <p className="text-sand-500 text-sm mt-2">Honoring ICC graduates making an impact worldwide</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {alumniSpotlights.map((spot, i) => (
                <Card key={i} className="p-6 hover:shadow-xl transition-all border border-sand-200">
                  <div className="h-12 w-12 rounded-2xl bg-gold-100 text-gold-700 flex items-center justify-center mb-4">
                    <spot.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="gold" className="mb-2 text-[10px] uppercase">
                    {spot.batch}
                  </Badge>
                  <h3 className="font-bold text-sand-900 text-xl mb-1">{spot.name}</h3>
                  <p className="text-xs font-semibold text-emerald-700 mb-3">{spot.role}</p>
                  <p className="text-xs text-sand-500 leading-relaxed">{spot.desc}</p>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* ASMAR Alumni Gallery */}
        <section className="py-16 bg-white border-y border-sand-200">
          <Container>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <Badge variant="gold" className="mb-2">Alumni Memories</Badge>
              <h2 className="text-3xl font-extrabold text-sand-900">ASMAR Reunions & Galas</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {alumniGallery.map((item) => (
                <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-sand-200 bg-sand-100">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gold-50">
                      <ImageIcon className="h-8 w-8 text-gold-400" />
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

        {/* ASMAR Registration / Directory Form */}
        <section id="register" className="py-16">
          <Container>
            <div className="max-w-2xl mx-auto">
              <Card className="p-8 border-2 border-gold-500/30 shadow-xl bg-white">
                <div className="text-center mb-8">
                  <Badge variant="gold" className="mb-2">Alumni Directory</Badge>
                  <h2 className="text-2xl font-extrabold text-sand-900">Register on ASMAR Directory</h2>
                  <p className="text-xs text-sand-500 mt-1">Connect with fellow ICC graduates, mentor current students, and receive reunion updates.</p>
                </div>

                <form action={handleASMARRegistration} className="space-y-4">
                  <Input label="Full Name" name="name" placeholder="Your full name" required />
                  <Input label="Email Address" type="email" name="email" placeholder="alumni@example.com" required />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Phone Number" type="tel" name="phone" placeholder="+1 (555) 000-0000" />
                    <Input label="Graduation Year" name="gradYear" placeholder="e.g. 2020" required />
                  </div>
                  <Textarea label="Profession & Location" name="profession" rows={3} placeholder="Current profession, company, or city of residence..." />

                  <Button type="submit" variant="gold" className="w-full font-bold py-3">
                    <Send className="h-4 w-4 mr-2" /> Complete ASMAR Directory Registration
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
