export const dynamic = "force-dynamic";
export const revalidate = 0;

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Programs from "@/components/landing/Programs";
import Events from "@/components/landing/Events";
import Donations from "@/components/landing/Donations";
import Gallery from "@/components/landing/Gallery";
import Testimonials from "@/components/landing/Testimonials";
import Contact from "@/components/landing/Contact";
import {
  fetchPrograms,
  fetchEvents,
  fetchTestimonials,
  fetchGalleryItems,
} from "@/lib/supabase/api";

export default async function HomePage() {
  // Asynchronously query live Supabase database tables on every request
  const programsData = await fetchPrograms();
  const eventsData = await fetchEvents();
  const testimonialsData = await fetchTestimonials();
  const galleryData = await fetchGalleryItems();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <Programs />
        <Events eventsList={eventsData} />
        <Donations />
        <Gallery itemsList={galleryData} />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
