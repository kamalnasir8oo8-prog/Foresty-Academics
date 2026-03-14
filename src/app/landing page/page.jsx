import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import Pricing from "./Pricing";
import CTA from "./CTA";
import Footer from "./Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-forest-950 overflow-x-hidden">
      <div
        className="relative"
        style={{
          backgroundImage: `url('/LandingPage.png')`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Persistent dark overlay for the whole page content */}
        <div className="absolute inset-0 bg-forest-950/65 pointer-events-none" />

        <div className="relative z-10">
          <Navbar />
          <Hero />
          <Features />
          <HowItWorks />
          <Pricing />
          <CTA />
        </div>
      </div>
      <Footer />
    </main>
  );
}
