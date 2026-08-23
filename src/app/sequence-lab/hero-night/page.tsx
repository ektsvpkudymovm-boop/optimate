import type { Metadata } from "next";
import { ScrollSequenceHero } from "@/components/public/scroll-sequence-hero";

export const metadata: Metadata = {
  title: "Sequence Hero Lab | OptiMate",
  description: "Изолированная проверка scroll-linked WebP hero для главной OptiMate.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function HeroNightSequenceLabPage() {
  return <ScrollSequenceHero id="sequence-lab-hero-title" />;
}
