import type { Metadata } from "next";
import { HeroSection } from "@/components/landing-v2/hero-section";
import { HiddenCostSection } from "@/components/landing-v2/hidden-cost-section";
import { LandingV2Header } from "@/components/landing-v2/landing-v2-header";
import { CompanyContextSection } from "@/components/landing-v2/company-context-section";
import { KnowledgeSection } from "@/components/landing-v2/knowledge-section";
import { CallAnalysisSection } from "@/components/landing-v2/call-analysis-section";
import { MarketInsightsSection } from "@/components/landing-v2/market-insights-section";
import { AutomationArchitectureSection } from "@/components/landing-v2/automation-architecture-section";
import { HowWeWorkSection } from "@/components/landing-v2/how-we-work-section";
import { CasesSection } from "@/components/landing-v2/cases-section";
import { MiniAuditSection } from "@/components/landing-v2/mini-audit-section";
import { LandingV2FaqSection } from "@/components/landing-v2/faq-section";
import { FinalCtaSection } from "@/components/landing-v2/final-cta-section";
import styles from "./landing-v2.module.css";

export const metadata: Metadata = { title: "OptiMate — новая система для бизнеса", description: "Рабочая страница нового лендинга OptiMate: Hero Block 01.", robots: { index: false, follow: false } };

export default function LandingV2Page() {
  return (
    <div className={styles.landingV2}>
      <LandingV2Header />
      <main>
        <HeroSection />
        <HiddenCostSection />
        <CompanyContextSection />
        <KnowledgeSection />
        <CallAnalysisSection />
        <MarketInsightsSection />
        <AutomationArchitectureSection />
        <HowWeWorkSection />
        <CasesSection />
        <MiniAuditSection />
        <LandingV2FaqSection />
        <FinalCtaSection />
      </main>
    </div>
  );
}
