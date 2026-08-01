"use client";

import React from "react";
import Link from "next/link";
import {
  Star,
  Mail,
  Phone,
  MapPin,
  Globe,
  ExternalLink,
  Video,
  Heart,
  ArrowUp,
} from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-emerald-950 text-white overflow-hidden">
      {/* Decorative Pattern Overlay */}
      <div className="absolute inset-0 star-pattern-bg pointer-events-none" />

      {/* Gold Accent Line */}
      <div className="h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 shadow-lg">
                <Star className="h-5 w-5 text-gold-400 fill-gold-400" />
              </div>
              <div>
                <span className="text-xl font-bold">ICC</span>
                <p className="text-[10px] tracking-widest uppercase text-emerald-300 -mt-0.5">
                  Charity Center
                </p>
              </div>
            </div>
            <p className="text-emerald-200/70 text-sm leading-relaxed mb-6">
              Serving the community through Islamic education, charitable
              programs, and spiritual growth since 2005.
            </p>
            <div className="flex gap-3">
              {[Globe, ExternalLink, Video].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-10 w-10 rounded-xl bg-emerald-900/50 flex items-center justify-center text-emerald-300 hover:bg-gold-600 hover:text-white transition-all duration-300"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold-400 mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {["About Us", "Programs", "Events", "Gallery", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase().replace(" ", "")}`}
                      className="text-emerald-200/70 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                    >
                      <span className="h-1 w-1 rounded-full bg-gold-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold-400 mb-6">
              Our Programs
            </h4>
            <ul className="space-y-3">
              {[
                "Quranic Studies",
                "Youth Leadership",
                "Community Relief",
                "Islamic Education",
                "Women's Circle",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#programs"
                    className="text-emerald-200/70 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="h-1 w-1 rounded-full bg-gold-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold-400 mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gold-400 mt-0.5 shrink-0" />
                <span className="text-emerald-200/70 text-sm">
                  123 Community Way
                  <br />
                  Springfield, IL 62704
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gold-400 shrink-0" />
                <span className="text-emerald-200/70 text-sm">
                  (555) 123-4567
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gold-400 shrink-0" />
                <span className="text-emerald-200/70 text-sm">
                  info@iccenter.org
                </span>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-sm text-emerald-200/70 mb-3">
                Subscribe to our newsletter
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-emerald-900/50 border border-emerald-700 rounded-l-xl px-4 py-2.5 text-sm text-white placeholder:text-emerald-400/50 focus:outline-none focus:border-gold-500"
                />
                <button className="btn-gold rounded-r-xl px-4 py-2.5 text-sm font-semibold cursor-pointer">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-emerald-800/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-emerald-300/50 text-sm">
              © {new Date().getFullYear()} Islamic Charity Center. All rights
              reserved.
            </p>
            <div className="flex items-center gap-1 text-emerald-300/50 text-sm">
              Made with <Heart className="h-3 w-3 text-red-400 fill-red-400" />{" "}
              for the community
            </div>
            <div className="flex gap-6 text-sm text-emerald-300/50">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 h-12 w-12 rounded-full btn-gradient text-white shadow-lg shadow-emerald-600/30 flex items-center justify-center hover:shadow-emerald-600/50 transition-all z-40 cursor-pointer"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </footer>
  );
}
