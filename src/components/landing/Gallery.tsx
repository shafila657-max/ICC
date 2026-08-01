"use client";

import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { Container, SectionHeading, Badge } from "@/components/ui";
import { GALLERY_ITEMS } from "@/lib/constants";
import type { GalleryItem } from "@/lib/types";

const PLACEHOLDER_COLORS = [
  "from-emerald-300 to-emerald-500",
  "from-gold-300 to-gold-500",
  "from-teal-300 to-teal-500",
  "from-emerald-400 to-cyan-500",
  "from-amber-300 to-orange-500",
  "from-emerald-200 to-emerald-400",
  "from-gold-400 to-amber-500",
  "from-teal-200 to-emerald-400",
];

interface GalleryProps {
  itemsList?: GalleryItem[];
}

export default function Gallery({ itemsList = GALLERY_ITEMS }: GalleryProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ["All", ...Array.from(new Set(itemsList.map((item) => item.category)))];

  const filtered =
    activeCategory === "All"
      ? itemsList
      : itemsList.filter((item) => item.category === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goPrev = () =>
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + filtered.length) % filtered.length : null
    );
  const goNext = () =>
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % filtered.length : null
    );

  return (
    <section id="gallery" className="section-padding bg-white">
      <Container>
        <SectionHeading
          badge="Gallery"
          title="Moments of Impact"
          subtitle="Witness the positive change our community creates together."
        />

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                activeCategory === cat
                  ? "btn-gradient text-white shadow-md font-bold"
                  : "bg-sand-100 text-sand-600 hover:bg-sand-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item, i) => (
            <button
              key={item.id}
              onClick={() => openLightbox(i)}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border border-sand-200 bg-sand-100 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${
                    PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length]
                  } flex items-center justify-center`}
                >
                  <ImageIcon className="h-10 w-10 text-white/40" />
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div>
                  <p className="text-white font-bold text-sm text-left">
                    {item.title}
                  </p>
                  <Badge variant="gold" className="mt-1 text-[10px]">
                    {item.category}
                  </Badge>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Container>

      {/* Lightbox Viewer */}
      {lightboxIndex !== null && filtered[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-50 cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            onClick={goPrev}
            className="absolute left-4 md:left-8 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <div className="max-w-4xl max-h-[80vh] w-full mx-8 flex flex-col items-center justify-center">
            {filtered[lightboxIndex].image_url ? (
              <img
                src={filtered[lightboxIndex].image_url}
                alt={filtered[lightboxIndex].title}
                className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-white/20"
              />
            ) : (
              <div
                className={`w-full aspect-video rounded-2xl bg-gradient-to-br ${
                  PLACEHOLDER_COLORS[lightboxIndex % PLACEHOLDER_COLORS.length]
                } flex items-center justify-center`}
              >
                <ImageIcon className="h-16 w-16 text-white/40" />
              </div>
            )}

            <div className="mt-4 text-center text-white">
              <p className="text-xl font-bold">{filtered[lightboxIndex].title}</p>
              <Badge variant="gold" className="mt-1">
                {filtered[lightboxIndex].category}
              </Badge>
            </div>
          </div>

          <button
            onClick={goNext}
            className="absolute right-4 md:right-8 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {filtered.map((_, i) => (
              <button
                key={i}
                onClick={() => setLightboxIndex(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  i === lightboxIndex
                    ? "w-8 bg-gold-400"
                    : "w-2 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
