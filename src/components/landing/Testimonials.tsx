"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Container, SectionHeading, Avatar } from "@/components/ui";
import { TESTIMONIALS } from "@/lib/constants";

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(
        ((index % TESTIMONIALS.length) + TESTIMONIALS.length) %
          TESTIMONIALS.length
      );
    },
    []
  );

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => goTo(activeIndex + 1), 5000);
    return () => clearInterval(interval);
  }, [activeIndex, isAutoPlaying, goTo]);

  const testimonial = TESTIMONIALS[activeIndex];

  return (
    <section id="testimonials" className="section-padding bg-sand-50 relative">
      <div className="absolute inset-0 islamic-pattern-bg pointer-events-none" />
      <Container className="relative">
        <SectionHeading
          badge="Testimonials"
          title="Voices of Our Community"
          subtitle="Hear from the students, donors, and volunteers whose lives have been touched."
        />

        <div className="max-w-4xl mx-auto">
          {/* Main Testimonial Card */}
          <div
            className="relative bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-sand-100 overflow-hidden"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Decorative Quote */}
            <Quote className="absolute top-6 right-6 h-16 w-16 text-emerald-100 rotate-180" />

            <div className="relative z-10">
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < testimonial.rating
                        ? "text-gold-400 fill-gold-400"
                        : "text-sand-200"
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-lg md:text-xl text-sand-700 leading-relaxed mb-8 min-h-[80px]">
                &ldquo;{testimonial.content}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <Avatar name={testimonial.name} size="lg" />
                <div>
                  <p className="font-bold text-sand-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-emerald-600 font-medium">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom accent */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-gold-400 to-emerald-500" />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => goTo(activeIndex - 1)}
              className="h-10 w-10 rounded-full border border-sand-200 flex items-center justify-center text-sand-400 hover:border-emerald-400 hover:text-emerald-600 transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === activeIndex
                      ? "w-8 bg-emerald-600"
                      : "w-2 bg-sand-300 hover:bg-sand-400"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => goTo(activeIndex + 1)}
              className="h-10 w-10 rounded-full border border-sand-200 flex items-center justify-center text-sand-400 hover:border-emerald-400 hover:text-emerald-600 transition-colors cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
