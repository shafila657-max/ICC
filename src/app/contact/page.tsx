import React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  HelpCircle,
  ExternalLink,
  MessageSquare,
  Globe,
  Share2,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container, Badge, Card, Button, Input, Textarea } from "@/components/ui";
import { submitContactMessage } from "@/lib/supabase/api";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  async function handleContactForm(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    await submitContactMessage({
      name,
      email,
      subject: subject || "General Inquiry",
      message,
    });
  }

  const googleMapsUrl = "https://maps.app.goo.gl/jncMLa6U4VD3vmzH6";

  const contactCards = [
    {
      title: "Visit Us",
      value: "123 Community Way",
      sub: "Springfield, IL 62704",
      actionText: "Open in Google Maps →",
      href: googleMapsUrl,
      isExternal: true,
      icon: MapPin,
      color: "from-emerald-500 to-emerald-700",
    },
    {
      title: "Call Us",
      value: "(555) 123-4567",
      sub: "Mon–Fri, 9am–5pm",
      actionText: "Call Now →",
      href: "tel:5551234567",
      isExternal: false,
      icon: Phone,
      color: "from-blue-500 to-blue-700",
    },
    {
      title: "Email Us",
      value: "info@iccenter.org",
      sub: "admin@iccenter.org",
      actionText: "Send Mail →",
      href: "mailto:info@iccenter.org",
      isExternal: false,
      icon: Mail,
      color: "from-gold-500 to-amber-700",
    },
    {
      title: "Office Hours",
      value: "Mon–Fri: 9am–5pm",
      sub: "Sat–Sun: 10am–2pm",
      actionText: "Walk-ins Welcome",
      href: "#",
      isExternal: false,
      icon: Clock,
      color: "from-purple-500 to-purple-700",
    },
  ];

  const socialLinks = [
    { name: "Facebook", handle: "@ICCenterOfficial", href: "https://facebook.com", color: "hover:border-blue-500 hover:text-blue-600" },
    { name: "Instagram", handle: "@ICC_Community", href: "https://instagram.com", color: "hover:border-pink-500 hover:text-pink-600" },
    { name: "Twitter / X", handle: "@ICC_Org", href: "https://twitter.com", color: "hover:border-sky-500 hover:text-sky-600" },
    { name: "YouTube", handle: "ICC Community Channel", href: "https://youtube.com", color: "hover:border-red-500 hover:text-red-600" },
    { name: "LinkedIn", handle: "Islamic Charity Center", href: "https://linkedin.com", color: "hover:border-blue-700 hover:text-blue-700" },
    { name: "WhatsApp", handle: "+1 (555) 123-4567", href: "https://wa.me/15551234567", color: "hover:border-emerald-500 hover:text-emerald-600" },
  ];

  const faqs = [
    {
      q: "How can I volunteer?",
      a: "We welcome volunteers across all our education, youth, and relief programs! Fill out the contact form or register through our ACSA & ASMAR portals to join our volunteer squad.",
    },
    {
      q: "Is my donation tax-deductible?",
      a: "Yes, ICC is a registered 501(c)(3) non-profit organization. All contributions are 100% tax-deductible. Official receipts are issued automatically upon donation.",
    },
    {
      q: "What programs are available for children?",
      a: "We offer weekend Islamic school, Tajweed & Quran memorization, youth leadership summer camps, and sports clubs designed for all age groups.",
    },
    {
      q: "How do you distribute Zakat?",
      a: "Zakat funds are strictly audited and distributed 100% to verified local families in need, emergency relief efforts, and educational scholarships in accordance with Islamic jurisprudence.",
    },
  ];

  return (
    <div className="min-h-screen bg-sand-50 flex flex-col">
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Contact Hero Banner */}
        <section className="relative bg-gradient-to-br from-emerald-950 via-emerald-900 to-sand-950 text-white pt-32 pb-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gold-500/15 rounded-full blur-3xl" />

          <Container className="relative z-10 text-center max-w-3xl">
            <Badge variant="gold" className="mb-4 uppercase tracking-widest text-xs font-bold">
              Contact & Support
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
              Get in Touch
            </h1>
            <p className="text-lg text-emerald-100/90 leading-relaxed">
              We&apos;d love to hear from you. Reach out with questions, feedback, or to get involved with the Islamic Charity Center.
            </p>
          </Container>
        </section>

        {/* Interactive Contact Method Cards */}
        <Container className="-mt-12 relative z-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactCards.map((card, idx) => (
              <a
                key={idx}
                href={card.href}
                target={card.isExternal ? "_blank" : undefined}
                rel={card.isExternal ? "noopener noreferrer" : undefined}
                className="group block"
              >
                <Card className="p-6 h-full border-2 border-sand-200 hover:border-emerald-500/50 hover:shadow-2xl transition-all duration-300 bg-white flex flex-col justify-between">
                  <div>
                    <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                      <card.icon className="h-6 w-6" />
                    </div>
                    <p className="text-xs font-bold text-sand-400 uppercase tracking-wider mb-1">{card.title}</p>
                    <p className="text-base font-extrabold text-sand-900 group-hover:text-emerald-700 transition-colors">
                      {card.value}
                    </p>
                    <p className="text-xs text-sand-500 mt-1">{card.sub}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-sand-100 flex items-center text-xs font-bold text-emerald-600 group-hover:text-emerald-800">
                    <span>{card.actionText}</span>
                    {card.isExternal && <ExternalLink className="h-3.5 w-3.5 ml-1" />}
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </Container>

        {/* Form & Map Section */}
        <Container className="mt-16">
          <div className="grid lg:grid-cols-12 gap-10">
            {/* Send a Message Form */}
            <div className="lg:col-span-6">
              <Card className="p-8 border-2 border-sand-200 shadow-xl bg-white">
                <div className="mb-6">
                  <Badge variant="success" className="mb-2">Send a Message</Badge>
                  <h2 className="text-2xl font-extrabold text-sand-900">We respond within 24 hours</h2>
                  <p className="text-xs text-sand-500 mt-1">Have a inquiry or feedback? Send us a direct message.</p>
                </div>

                <form action={handleContactForm} className="space-y-4">
                  <Input
                    label="Your Name"
                    name="name"
                    placeholder="Full name"
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
                    label="Subject"
                    name="subject"
                    placeholder="How can we help?"
                    required
                  />

                  <Textarea
                    label="Message"
                    name="message"
                    rows={4}
                    placeholder="Write your message..."
                    required
                  />

                  <Button type="submit" className="w-full font-bold py-3.5">
                    <Send className="h-4 w-4 mr-2" /> Send Message
                  </Button>
                </form>
              </Card>
            </div>

            {/* Live Interactive Map & Location Details */}
            <div className="lg:col-span-6 space-y-6">
              <Card className="p-4 border-2 border-sand-200 bg-white overflow-hidden">
                <div className="flex items-center justify-between p-2 mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                    <span className="font-bold text-sand-900 text-sm">Live Location — Springfield Campus</span>
                  </div>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                  >
                    Google Maps <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                {/* Embedded Live Google Maps Iframe */}
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-sand-200 shadow-inner">
                  <iframe
                    title="ICC Location Map"
                    src="https://maps.google.com/maps?q=https://maps.app.goo.gl/jncMLa6U4VD3vmzH6&output=embed"
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </Card>

              {/* Social Media Handles */}
              <Card className="p-6">
                <h3 className="font-bold text-sand-900 text-base mb-4 flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-gold-500" /> Connect on Social Media
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {socialLinks.map((s, idx) => (
                    <a
                      key={idx}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 rounded-xl border border-sand-200 bg-sand-50/50 hover:bg-white transition-all text-left ${s.color} block`}
                    >
                      <p className="font-bold text-xs text-sand-900">{s.name}</p>
                      <p className="text-[10px] text-sand-400 truncate">{s.handle}</p>
                    </a>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </Container>

        {/* Frequently Asked Questions */}
        <section className="mt-20 py-16 bg-white border-t border-sand-200">
          <Container className="max-w-4xl">
            <div className="text-center mb-12">
              <Badge variant="gold" className="mb-2">FAQ</Badge>
              <h2 className="text-3xl font-extrabold text-sand-900">Frequently Asked Questions</h2>
              <p className="text-sand-500 text-sm mt-2">Quick answers to common questions about ICC</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-sand-50 border border-sand-200 hover:border-emerald-300 transition-colors">
                  <h3 className="font-bold text-sand-900 text-base mb-2 flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                    {faq.q}
                  </h3>
                  <p className="text-sand-600 text-sm leading-relaxed pl-7">{faq.a}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
