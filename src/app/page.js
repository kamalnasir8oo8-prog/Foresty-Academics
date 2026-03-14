import Navbar from "./landing page/Navbar";
import Hero from "./landing page/Hero";
import Features from "./landing page/Features";
import HowItWorks from "./landing page/HowItWorks";
import Pricing from "./landing page/Pricing";
import CTA from "./landing page/CTA";
import Footer from "./landing page/Footer";

export default function HomePage() {
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
        <div className="absolute inset-0 bg-forest-950/65 backdrop-blur-[1px] pointer-events-none" />
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
