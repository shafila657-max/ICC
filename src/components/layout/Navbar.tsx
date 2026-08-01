"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Heart, Moon, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-emerald-900/5 py-2"
          : "bg-transparent py-4"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center p-1 rounded-xl bg-white/90 shadow-md group-hover:scale-105 transition-transform">
              <img src="/logo.png" alt="ICC Logo" className="h-10 w-auto object-contain" />
            </div>
            <div className="flex flex-col">
              <span
                className={cn(
                  "text-xl font-bold tracking-tight transition-colors",
                  isScrolled ? "text-emerald-900" : "text-white"
                )}
              >
                ICC
              </span>
              <span
                className={cn(
                  "text-[10px] font-medium tracking-widest uppercase transition-colors -mt-0.5",
                  isScrolled ? "text-sand-500" : "text-emerald-200"
                )}
              >
                Islamic Charity Center
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-emerald-50/80",
                  isScrolled
                    ? "text-sand-600 hover:text-emerald-700"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/login">
              <Button
                variant={isScrolled ? "ghost" : "outline"}
                size="sm"
                className={cn(
                  !isScrolled &&
                    "border-white/30 text-white hover:bg-white/10"
                )}
              >
                Sign In
              </Button>
            </Link>
            <a href="#donate">
              <Button variant="gold" size="sm">
                <Heart className="h-4 w-4" />
                Donate
              </Button>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "lg:hidden p-2 rounded-lg transition-colors cursor-pointer",
              isScrolled
                ? "text-sand-700 hover:bg-sand-100"
                : "text-white hover:bg-white/10"
            )}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            isMobileMenuOpen ? "max-h-96 mt-4" : "max-h-0"
          )}
        >
          <div className="rounded-2xl bg-white/95 backdrop-blur-xl shadow-xl border border-sand-200 p-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-sand-700 font-medium hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-sand-200 flex gap-2">
              <Link href="/login" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  Sign In
                </Button>
              </Link>
              <a href="#donate" className="flex-1">
                <Button variant="gold" size="sm" className="w-full">
                  <Heart className="h-4 w-4" />
                  Donate
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
