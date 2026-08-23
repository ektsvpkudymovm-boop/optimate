"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HiddenCostHeader } from "./hidden-cost-header";
import { LossRegister } from "./loss-register";
import { LossProcess } from "./loss-process";
import {
  hiddenCostPrinciple,
  hiddenCostScenarios,
  type LossScenarioId,
} from "./hidden-cost-data";
import styles from "@/app/landing-v2/landing-v2.module.css";

const firstScenario = hiddenCostScenarios[0]?.id ?? "information";

export function HiddenCostSection() {
  const [selectedScenario, setSelectedScenario] = useState<LossScenarioId>(firstScenario);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [principleVisible, setPrincipleVisible] = useState(false);

  const activeScenario = useMemo(
    () => hiddenCostScenarios.find((scenario) => scenario.id === selectedScenario) ?? hiddenCostScenarios[0],
    [selectedScenario],
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const principle = section.querySelector<HTMLElement>(`[data-principle]`);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setPrincipleVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.42 },
    );

    if (principle) observer.observe(principle);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 769px)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const rows = section.querySelectorAll<HTMLElement>("[data-loss-row]");
    const context = gsap.context(() => {
      gsap.fromTo(rows, { autoAlpha: 0, x: 24 }, {
        autoAlpha: 1,
        x: 0,
        duration: 0.46,
        stagger: 0.085,
        ease: "power2.out",
        clearProps: "transform,opacity,visibility",
        scrollTrigger: {
          trigger: section,
          start: "top 64%",
          toggleActions: "play none none none",
          once: true,
        },
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} id="hidden-cost" className={styles.hiddenCostSection} aria-labelledby="hidden-cost-title">
      <div className={styles.hiddenCostGrid}>
        <HiddenCostHeader />
        <div className={styles.hiddenCostAuditSurface}>
          <LossRegister selectedScenario={selectedScenario} onSelectScenario={(next) => setSelectedScenario(next)} />
          <aside className={styles.hiddenCostProcessPanel} aria-live="polite">
            <p className={styles.hiddenCostProcessTitle}>Как выглядит потеря</p>
            <div key={activeScenario.id} className={`${styles.hiddenCostProcessContent} ${styles.lossProcessContentEnter}`}>
              <LossProcess steps={activeScenario.sequence} />
            </div>
          </aside>
        </div>
        <p
          data-principle
          data-visible={principleVisible ? "true" : "false"}
          className={styles.hiddenCostPrinciple}
          aria-label={hiddenCostPrinciple}
        >
          <span>Мелкая <em data-order="1">ручная операция</em> × <em data-order="2">команда</em> × <em data-order="3">рабочие дни</em> × <em data-order="4">месяцы</em> = </span>
          <strong>постоянный системный расход</strong>
        </p>
      </div>
    </section>
  );
}
