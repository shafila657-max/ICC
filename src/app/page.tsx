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

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <Programs />
        <Events />
        <Donations />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
