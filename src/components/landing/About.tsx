"use client";

import React from "react";
import { BookOpen, Heart, Users, Target, CheckCircle2 } from "lucide-react";
import { Container, SectionHeading, Card } from "@/components/ui";

const VALUES = [
  {
    icon: BookOpen,
    title: "Knowledge",
    description: "Promoting authentic Islamic learning for all ages.",
  },
  {
    icon: Heart,
    title: "Compassion",
    description: "Serving those in need with mercy and generosity.",
  },
  {
    icon: Users,
    title: "Unity",
    description: "Strengthening bonds within our diverse community.",
  },
  {
    icon: Target,
    title: "Excellence",
    description: "Striving for the highest standards in everything we do.",
  },
];

const HIGHLIGHTS = [
  "Established in 2005 with a vision for community growth",
  "Served 50,000+ community members across all programs",
  "100% transparent donation tracking and distribution",
  "Certified scholars and qualified educators",
  "Partnerships with 20+ international relief organizations",
];

export default function About() {
  return (
    <section id="about" className="section-padding bg-sand-50 relative">
      <div className="absolute inset-0 islamic-pattern-bg pointer-events-none" />
      <Container className="relative">
        <SectionHeading
          badge="About Us"
          title="Rooted in Faith, Driven by Service"
          subtitle="For nearly two decades, ICC has been a beacon of hope, education, and community support."
        />

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left: Story */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Our Mission
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-sand-900">
              Empowering the Ummah Through{" "}
              <span className="gradient-text">Education & Service</span>
            </h3>
            <p className="text-sand-600 leading-relaxed">
              The Islamic Charity Center was founded with a simple yet profound
              mission: to create a thriving community rooted in Islamic
              values, accessible education, and selfless service. We believe
              that every individual deserves the opportunity to learn, grow,
              and contribute to society.
            </p>
            <p className="text-sand-600 leading-relaxed">
              From Quranic studies to community relief, youth mentorship to
              interfaith dialogue, our programs touch lives across generations.
              Every donation, every volunteer hour, and every prayer makes our
              mission possible.
            </p>

            <ul className="space-y-3">
              {HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-sand-600 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Image Placeholder with Islamic Arch */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-emerald-100 to-emerald-200">
              {/* Islamic arch frame */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-emerald-600/20 flex items-center justify-center">
                    <Heart className="h-12 w-12 text-emerald-700" />
                  </div>
                  <p className="text-emerald-800 font-semibold text-lg">
                    &ldquo;The best of people are those who are most beneficial
                    to people.&rdquo;
                  </p>
                  <p className="text-emerald-600 text-sm mt-2">
                    — Prophet Muhammad ﷺ
                  </p>
                </div>
              </div>
              {/* Decorative arch shape */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[50%]">
                <div className="w-full h-full border-2 border-gold-400/30 rounded-b-[100%] border-t-0" />
              </div>
            </div>

            {/* Stats floating card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-sand-100 animate-float">
              <div className="text-2xl font-bold text-emerald-700">18+</div>
              <div className="text-sm text-sand-500">Years of Service</div>
            </div>
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-sand-100 animate-float" style={{ animationDelay: "3s" }}>
              <div className="text-2xl font-bold text-gold-600">50K+</div>
              <div className="text-sm text-sand-500">Lives Touched</div>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {VALUES.map((value, i) => (
            <Card key={value.title} hover className="text-center group">
              <div className="h-14 w-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center group-hover:from-emerald-100 group-hover:to-emerald-200 transition-colors">
                <value.icon className="h-6 w-6 text-emerald-600" />
              </div>
              <h4 className="font-bold text-sand-900 mb-2">{value.title}</h4>
              <p className="text-sm text-sand-500">{value.description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
