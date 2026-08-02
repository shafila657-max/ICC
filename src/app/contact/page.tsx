"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  ChevronDown,
  ExternalLink,
  Globe,
  MessageCircle
} from "lucide-react";
import {
  Container,
  SectionHeading,
  Card,
  Button,
  Input,
  Textarea,
} from "@/components/ui";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { submitContactMessage } from "@/lib/supabase/api";

const CONTACT_INFO = [
  {
    icon: MapPin,
    title: "Visit Us",
    lines: ["123 Community Way", "Springfield, IL 62704"],
    href: "https://maps.app.goo.gl/V3KyUaBe71stUVxn6",
    isExternal: true
  },
  {
    icon: Phone,
    title: "Call Us",
    lines: ["(555) 123-4567", "Mon–Fri, 9am–5pm"],
    href: "tel:+15551234567"
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: ["info@iccenter.org", "admin@iccenter.org"],
    href: "mailto:info@iccenter.org"
  },
  {
    icon: Clock,
    title: "Office Hours",
    lines: ["Mon–Fri: 9am–5pm", "Sat–Sun: 10am–2pm"],
  },
];

const FAQS = [
  {
    q: "How can I volunteer?",
    a: "Visit our center or fill out the contact form. We have opportunities in education, relief, events, and administration.",
  },
  {
    q: "Is my donation tax-deductible?",
    a: "Yes! ICC is a registered 501(c)(3) nonprofit. You will receive a tax receipt for all donations.",
  },
  {
    q: "What programs are available for children?",
    a: "We offer Quranic studies, weekend Islamic school, youth leadership camp, and summer programs for ages 5–17.",
  },
];

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");

    await submitContactMessage({
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    });

    setFormStatus("success");
    setTimeout(() => {
      setFormStatus("idle");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-12 bg-sand-50/30">
        <section id="contact" className="section-padding">
          <Container>
            <SectionHeading
              badge="Contact Us"
              title="Get in Touch"
              subtitle="We'd love to hear from you. Reach out with questions, feedback, or to get involved with our community."
            />

            <div className="grid lg:grid-cols-5 gap-8">
              {/* Contact Form */}
              <div className="lg:col-span-3">
                <Card className="p-8 h-full bg-white shadow-xl shadow-sand-200/50 border-sand-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sand-900 text-xl">Send a Message</h3>
                      <p className="text-sm text-sand-500">
                        We typically respond within 24 hours
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <Input
                        label="Your Name"
                        id="contact-name"
                        placeholder="Full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="bg-sand-50/50"
                      />
                      <Input
                        label="Email Address"
                        id="contact-email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="bg-sand-50/50"
                      />
                    </div>
                    <Input
                      label="Subject"
                      id="contact-subject"
                      placeholder="How can we help?"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="bg-sand-50/50"
                    />
                    <Textarea
                      label="Message"
                      id="contact-message"
                      placeholder="Write your message..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="bg-sand-50/50"
                    />

                    {formStatus === "success" ? (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center transform transition-all">
                        <p className="text-emerald-700 font-medium flex items-center justify-center gap-2">
                          <span className="text-xl">✅</span> Message sent successfully! We'll be in touch soon.
                        </p>
                      </div>
                    ) : (
                      <Button type="submit" size="lg" className="w-full h-14 text-base" disabled={formStatus === "submitting"}>
                        <Send className="h-5 w-5 mr-2" />
                        {formStatus === "submitting" ? "Sending Message..." : "Send Message"}
                      </Button>
                    )}
                  </form>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contact Cards */}
                <div className="grid grid-cols-2 gap-4">
                  {CONTACT_INFO.map((item) => {
                    const cardContent = (
                      <Card
                        hover
                        className={`text-center p-5 border-sand-200 h-full transition-colors ${item.href ? 'group-hover:border-emerald-300' : ''}`}
                      >
                        <div className="h-12 w-12 mx-auto mb-4 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center relative group-hover:scale-110 transition-transform">
                          <item.icon className="h-6 w-6" />
                          {item.href && (
                            <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                              <ExternalLink className="h-3 w-3 text-sand-400" />
                            </div>
                          )}
                        </div>
                        <h4 className="font-bold text-sand-900 text-sm mb-2">
                          {item.title}
                        </h4>
                        {item.lines.map((line, idx) => (
                          <p key={idx} className="text-xs text-sand-600 font-medium">
                            {line}
                          </p>
                        ))}
                      </Card>
                    );
                    
                    return item.href ? (
                      <a
                        key={item.title}
                        href={item.href}
                        target={item.isExternal ? "_blank" : undefined}
                        rel={item.isExternal ? "noopener noreferrer" : undefined}
                        className="block h-full group"
                      >
                        {cardContent}
                      </a>
                    ) : (
                      <div key={item.title} className="h-full group">
                        {cardContent}
                      </div>
                    );
                  })}
                </div>

                {/* Social Media Links */}
                <Card className="p-6 bg-emerald-900 text-white border-none shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <MessageSquare className="w-32 h-32" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="font-bold text-white mb-2 text-lg">Connect With Us</h3>
                    <p className="text-emerald-100 text-xs mb-6">Stay updated with our latest events and announcements across all our social platforms.</p>
                    <div className="flex items-center gap-3">
                      {[
                        { icon: Globe, label: "Facebook", href: "#" },
                        { icon: MessageCircle, label: "Twitter", href: "#" },
                        { icon: Globe, label: "Instagram", href: "#" },
                        { icon: Globe, label: "YouTube", href: "#" },
                      ].map((social) => (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-10 w-10 rounded-full bg-white/10 hover:bg-white text-white hover:text-emerald-900 flex items-center justify-center transition-all hover:scale-110"
                          aria-label={social.label}
                        >
                          <social.icon className="h-5 w-5" />
                        </a>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* FAQ */}
                <Card className="p-6 border-sand-200 shadow-lg">
                  <h3 className="font-bold text-sand-900 mb-4 text-lg">
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-3">
                    {FAQS.map((faq, i) => (
                      <div
                        key={i}
                        className={`border rounded-xl overflow-hidden transition-colors ${openFaq === i ? 'border-emerald-200 bg-emerald-50/50' : 'border-sand-100 bg-white hover:border-sand-300'}`}
                      >
                        <button
                          onClick={() => setOpenFaq(openFaq === i ? null : i)}
                          className="w-full flex items-center justify-between p-4 text-left text-sm font-semibold text-sand-900 cursor-pointer"
                        >
                          {faq.q}
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 text-emerald-600 transition-transform ${
                              openFaq === i ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            openFaq === i ? "max-h-40" : "max-h-0"
                          }`}
                        >
                          <p className="px-4 pb-4 text-sm text-sand-600 leading-relaxed font-medium">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </Container>
        </section>

        {/* Live Location Map */}
        <section className="w-full h-[400px] mt-12 relative border-y border-sand-200 overflow-hidden shadow-inner bg-sand-200">
          <div className="absolute inset-0 z-10 pointer-events-none bg-emerald-950/5 mix-blend-multiply" />
          <iframe
            src="https://maps.google.com/maps?q=ICC+Haseen+Academy,+Erumamunda,+Nilambur&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="ICC Live Location"
            className="w-full h-full object-cover filter contrast-125 saturate-50"
          ></iframe>
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl border border-sand-200 flex items-center gap-3">
              <MapPin className="h-5 w-5 text-emerald-600" />
              <span className="font-bold text-sand-900 text-sm">Find us at Springfield</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
