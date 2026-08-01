"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, Heart, Users, Calendar, BookOpen } from "lucide-react";
import { Button, Container } from "@/components/ui";
import { STATS } from "@/lib/constants";

function AnimatedCounter({
  target,
  prefix = "",
  suffix = "",
}: {
  target: number;
  prefix?: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

const STAT_ICONS = [BookOpen, Heart, Calendar, Users];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800" />
      <div className="absolute inset-0 star-pattern-bg" />

      {/* Decorative Circles */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-emerald-700/20 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-gold-600/10 blur-3xl" />

      {/* Floating geometric shapes */}
      <div className="absolute top-1/4 right-[15%] w-20 h-20 border border-gold-400/20 rotate-45 animate-float hidden lg:block" />
      <div className="absolute bottom-1/3 left-[10%] w-16 h-16 border border-emerald-400/20 rotate-12 animate-float hidden lg:block" style={{ animationDelay: "2s" }} />

      <Container className="relative z-10 py-32 md:py-40">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-emerald-200 text-sm font-medium mb-8 animate-fade-in-down">
            <span className="h-2 w-2 rounded-full bg-gold-400 animate-pulse-glow" />
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in-up leading-tight">
            Building a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500">
              Stronger
            </span>{" "}
            <br className="hidden md:block" />
            Community Together
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-emerald-100/70 max-w-2xl mx-auto mb-10 animate-fade-in-up leading-relaxed" style={{ animationDelay: "0.2s" }}>
            Empowering lives through Islamic education, charitable giving, and
            community development. Join us in making a difference.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <a href="#programs">
              <Button size="lg" className="min-w-[200px]">
                Our Programs
                <ArrowRight className="h-5 w-5" />
              </Button>
            </a>
            <a href="#donate">
              <Button variant="gold" size="lg" className="min-w-[200px]">
                <Heart className="h-5 w-5" />
                Donate Now
              </Button>
            </a>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            {STATS.map((stat, i) => {
              const Icon = STAT_ICONS[i];
              return (
                <div
                  key={stat.label}
                  className="relative group p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <Icon className="h-5 w-5 text-gold-400 mb-3 mx-auto" />
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                    <AnimatedCounter
                      target={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                  </div>
                  <p className="text-emerald-200/60 text-sm">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Container>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0,64 C360,120 720,0 1080,64 C1260,96 1380,80 1440,64 L1440,120 L0,120 Z"
            fill="#fafaf9"
          />
        </svg>
      </div>
    </section>
  );
}
