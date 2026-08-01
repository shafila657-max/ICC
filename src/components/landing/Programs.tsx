"use client";

import React from "react";
import { BookOpen, HeartHandshake, Sparkles, GraduationCap, Users, Shield, ArrowRight } from "lucide-react";
import { Container, SectionHeading, Card, Badge, Button } from "@/components/ui";
import { PROGRAMS } from "@/lib/constants";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  quran: BookOpen,
  youth: Sparkles,
  relief: HeartHandshake,
  education: GraduationCap,
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; badge: "success" | "gold" | "info" | "warning" }> = {
  quran: { bg: "from-emerald-50 to-emerald-100", text: "text-emerald-600", badge: "success" },
  youth: { bg: "from-blue-50 to-blue-100", text: "text-blue-600", badge: "info" },
  relief: { bg: "from-amber-50 to-amber-100", text: "text-amber-600", badge: "gold" },
  education: { bg: "from-purple-50 to-purple-100", text: "text-purple-600", badge: "warning" },
};

export default function Programs() {
  return (
    <section id="programs" className="section-padding bg-white relative">
      <Container>
        <SectionHeading
          badge="Our Programs"
          title="Programs That Make a Difference"
          subtitle="From Quranic studies to community relief, our programs serve diverse needs across all ages."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROGRAMS.map((program, i) => {
            const Icon = CATEGORY_ICONS[program.category] || BookOpen;
            const colors = CATEGORY_COLORS[program.category] || CATEGORY_COLORS.education;
            return (
              <Card key={program.id} hover className="group relative overflow-hidden">
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-gold-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                
                <div className="flex items-start gap-4">
                  <div className={`h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-br ${colors.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-6 w-6 ${colors.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={colors.badge}>
                        {program.category.charAt(0).toUpperCase() + program.category.slice(1)}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-sand-900 text-lg mb-2 group-hover:text-emerald-700 transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-sm text-sand-500 leading-relaxed">
                      {program.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-sand-100">
                  <button className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors group/btn cursor-pointer">
                    Learn More
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-gold-50 border border-emerald-100">
            <div className="h-12 w-12 rounded-xl bg-emerald-600 flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sand-900">Want to get involved?</p>
              <p className="text-sm text-sand-500">Join as a volunteer or enroll in a program</p>
            </div>
            <Button variant="primary" size="sm">
              Join Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
