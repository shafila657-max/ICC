import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Mail,
  BookOpen,
  Send,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container, Badge, Card, Button, Input, Textarea } from "@/components/ui";
import { fetchProgramById, submitContactMessage } from "@/lib/supabase/api";

export const dynamic = "force-dynamic";

interface ProgramDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const { id } = await params;
  const program = await fetchProgramById(id);

  if (!program) {
    notFound();
  }

  // Handle inquiry / registration submission
  async function handleRegister(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const message = formData.get("message") as string;

    await submitContactMessage({
      name,
      email,
      subject: `Program Registration Inquiry: ${program?.title}`,
      message: `Phone: ${phone}\n\nMessage: ${message}`,
    });
  }

  const defaultFeatures = [
    "Certified expert instructors & mentors",
    "Flexible schedules tailored for students & adults",
    "Interactive learning materials & workshops",
    "Community networking & growth opportunities",
  ];

  const features = program.features && program.features.length > 0 ? program.features : defaultFeatures;

  return (
    <div className="min-h-screen bg-sand-50 flex flex-col">
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Header Hero Section */}
        <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-sand-900 text-white pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          <Container className="relative z-10">
            <Link
              href="/#programs"
              className="inline-flex items-center gap-2 text-sand-200 hover:text-white transition-colors text-sm font-medium mb-8 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Back to All Programs
            </Link>

            <div className="max-w-3xl">
              <Badge variant="gold" className="mb-4 uppercase tracking-widest text-xs">
                {program.category} Program
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6">
                {program.title}
              </h1>
              <p className="text-lg text-sand-200 leading-relaxed mb-8">
                {program.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-sand-300">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gold-400" />
                  <span>{program.schedule || "Flexible Schedule"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gold-400" />
                  <span>{program.contact_email || "info@icc.org"}</span>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Content & Registration Grid */}
        <Container className="mt-12">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Banner if available */}
              {program.image_url && (
                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-lg border border-sand-200">
                  <img
                    src={program.image_url}
                    alt={program.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Full Detailed Description */}
              <Card>
                <h2 className="text-xl font-bold text-sand-900 mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-emerald-600" /> Program Overview
                </h2>
                <div className="text-sand-600 leading-relaxed space-y-4 whitespace-pre-line text-base">
                  {program.full_content || program.description || "Detailed program syllabus and description."}
                </div>
              </Card>

              {/* Program Features / Highlights */}
              <Card>
                <h2 className="text-xl font-bold text-sand-900 mb-6 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-gold-500" /> Program Key Highlights
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-sand-50 border border-sand-100">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-sand-800">{feat}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Sidebar Interactive Registration Form */}
            <div>
              <div className="sticky top-28">
                <Card className="border-2 border-emerald-500/30 shadow-xl bg-white">
                  <div className="mb-6">
                    <Badge variant="success" className="mb-2">
                      Enrollment Open
                    </Badge>
                    <h3 className="text-xl font-bold text-sand-900">
                      {program.cta_text || "Register / Get In Touch"}
                    </h3>
                    <p className="text-xs text-sand-500 mt-1">
                      Fill in your details below to register or inquire for {program.title}.
                    </p>
                  </div>

                  <form action={handleRegister} className="space-y-4">
                    <Input
                      label="Full Name"
                      name="name"
                      placeholder="Your full name"
                      required
                    />

                    <Input
                      label="Email Address"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      required
                    />

                    <Input
                      label="Phone Number"
                      type="tel"
                      name="phone"
                      placeholder="+1 (555) 000-0000"
                    />

                    <Textarea
                      label="Message / Special Requirements"
                      name="message"
                      rows={3}
                      placeholder={`I am interested in joining ${program.title}...`}
                    />

                    <Button type="submit" className="w-full font-bold py-3">
                      <Send className="h-4 w-4 mr-2" /> Submit Registration Inquiry
                    </Button>
                  </form>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
