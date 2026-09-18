import type { Metadata } from "next";
import { AmbientesShowcase } from "@/components/sections/AmbientesShowcase";
import { DnaSection } from "@/components/sections/DnaSection";
import { HomeHero } from "@/components/sections/HomeHero";
import { DecoradosReel, FinalCta, Partners, Testimonial } from "@/components/sections/HomeSections";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <AmbientesShowcase />
      <DnaSection />
      <DecoradosReel />
      <Testimonial />
      <Partners />
      <FinalCta />
    </>
  );
}
