import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { Solution } from "@/components/Solution";
import { Features } from "@/components/Features";
import { CaseStudy } from "@/components/CaseStudy";
import { Pricing } from "@/components/Pricing";
import { Waitlist } from "@/components/Waitlist";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Features />
        <CaseStudy />
        <Pricing />
        <Waitlist />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
