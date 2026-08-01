"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import {
  Container,
  SectionHeading,
  Card,
  Button,
  Input,
  Textarea,
} from "@/components/ui";

const CONTACT_INFO = [
  {
    icon: MapPin,
    title: "Visit Us",
    lines: ["123 Community Way", "Springfield, IL 62704"],
  },
  {
    icon: Phone,
    title: "Call Us",
    lines: ["(555) 123-4567", "Mon–Fri, 9am–5pm"],
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: ["info@iccenter.org", "admin@iccenter.org"],
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
  {
    q: "How do you distribute Zakat?",
    a: "Our Zakat committee follows strict Islamic guidelines to distribute funds to eligible recipients within the community and globally.",
  },
];

export default function Contact() {
  const [formStatus, setFormStatus] = useState<"idle" | "success">("idle");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("success");
    setTimeout(() => setFormStatus("idle"), 3000);
  };

  return (
    <section id="contact" className="section-padding bg-white">
      <Container>
        <SectionHeading
          badge="Contact"
          title="Get in Touch"
          subtitle="We'd love to hear from you. Reach out with questions, feedback, or to get involved."
        />

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-sand-900">Send a Message</h3>
                  <p className="text-sm text-sand-500">
                    We typically respond within 24 hours
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Your Name"
                    id="contact-name"
                    placeholder="Full name"
                    required
                  />
                  <Input
                    label="Email Address"
                    id="contact-email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <Input
                  label="Subject"
                  id="contact-subject"
                  placeholder="How can we help?"
                />
                <Textarea
                  label="Message"
                  id="contact-message"
                  placeholder="Write your message..."
                  rows={5}
                  required
                />

                {formStatus === "success" ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                    <p className="text-emerald-700 font-medium">
                      ✅ Message sent successfully! We&apos;ll be in touch soon.
                    </p>
                  </div>
                ) : (
                  <Button type="submit" size="lg" className="w-full">
                    <Send className="h-5 w-5" />
                    Send Message
                  </Button>
                )}
              </form>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Cards */}
            <div className="grid grid-cols-2 gap-4">
              {CONTACT_INFO.map((item) => (
                <Card key={item.title} hover className="text-center p-4">
                  <div className="h-10 w-10 mx-auto mb-3 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-sand-900 text-sm mb-1">
                    {item.title}
                  </h4>
                  {item.lines.map((line) => (
                    <p key={line} className="text-xs text-sand-500">
                      {line}
                    </p>
                  ))}
                </Card>
              ))}
            </div>

            {/* FAQ */}
            <Card className="p-6">
              <h3 className="font-bold text-sand-900 mb-4">
                Frequently Asked Questions
              </h3>
              <div className="space-y-2">
                {FAQS.map((faq, i) => (
                  <div
                    key={i}
                    className="border border-sand-100 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left text-sm font-medium text-sand-800 hover:bg-sand-50 transition-colors cursor-pointer"
                    >
                      {faq.q}
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-sand-400 transition-transform ${
                          openFaq === i ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openFaq === i ? "max-h-40" : "max-h-0"
                      }`}
                    >
                      <p className="px-4 pb-4 text-sm text-sand-500">
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
  );
}
