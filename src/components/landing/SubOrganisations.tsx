"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, Users, ArrowRight, Sparkles, CheckCircle2, Globe, HeartHandshake } from "lucide-react";
import { Container, SectionHeading, Card, Badge, Button } from "@/components/ui";

export default function SubOrganisations() {
  return (
    <section id="organisations" className="section-padding bg-gradient-to-b from-sand-50 via-white to-sand-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-gold-100/40 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        <SectionHeading
          badge="Sister Organisations"
          title="Empowering Students & Uniting Alumni"
          subtitle="Explore ICC's specialized bodies dedicated to student leadership and lifelong alumni connections."
        />

        <div className="grid lg:grid-cols-2 gap-8">
          {/* ACSA Card */}
          <Card className="group relative overflow-hidden border-2 border-emerald-500/20 hover:border-emerald-500/50 bg-white p-8 shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <GraduationCap className="h-40 w-40 text-emerald-700" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="success" className="px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  <Users className="h-3.5 w-3.5 mr-1" /> Student Body
                </Badge>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Active Campus Wing
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-sand-900 mb-3 group-hover:text-emerald-700 transition-colors">
                ACSA
              </h3>
              <p className="text-sand-500 font-semibold text-sm mb-4">
                Al-Hidayah Center Students Association
              </p>

              <p className="text-sand-600 text-sm leading-relaxed mb-6">
                The vibrant student wing of ICC. ACSA organizes student debates, academic mentorship, Quranic study circles, campus sports, and community outreach programs.
              </p>

              <div className="space-y-2.5 mb-8">
                {[
                  "Student Leadership & Cabinet Councils",
                  "Academic Mentorship & Peer Tutoring",
                  "Youth Camps & Islamic Halaqas",
                  "Community Service & Student Debates",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-medium text-sand-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-sand-100 flex items-center justify-between">
              <span className="text-xs text-sand-400 font-medium">1,200+ Student Members</span>
              <Link href="/acsa">
                <Button variant="primary" size="sm" className="font-bold group/btn">
                  Explore ACSA Portal
                  <ArrowRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </Card>

          {/* ASMAR Card */}
          <Card className="group relative overflow-hidden border-2 border-gold-500/20 hover:border-gold-500/50 bg-white p-8 shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Globe className="h-40 w-40 text-gold-600" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="gold" className="px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5 mr-1" /> Alumni Network
                </Badge>
                <span className="text-xs font-semibold text-gold-700 bg-gold-50 px-3 py-1 rounded-full border border-gold-200">
                  Global Network
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-sand-900 mb-3 group-hover:text-gold-700 transition-colors">
                ASMAR
              </h3>
              <p className="text-sand-500 font-semibold text-sm mb-4">
                Alumni Association of ICC
              </p>

              <p className="text-sand-600 text-sm leading-relaxed mb-6">
                Connecting ICC graduates around the globe. ASMAR fosters lifelong brotherhood, professional career mentoring, legacy endowment projects, and annual grand reunions.
              </p>

              <div className="space-y-2.5 mb-8">
                {[
                  "Global Alumni Directory & Wall of Fame",
                  "Professional Career & Academic Mentoring",
                  "Annual Alumni Reunion Galas",
                  "Endowment & Legacy Community Projects",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-medium text-sand-700">
                    <CheckCircle2 className="h-4 w-4 text-gold-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-sand-100 flex items-center justify-between">
              <span className="text-xs text-sand-400 font-medium">850+ Registered Alumni</span>
              <Link href="/asmar">
                <Button variant="gold" size="sm" className="font-bold group/btn">
                  Explore ASMAR Network
                  <ArrowRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}
