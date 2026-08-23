"use client";

import { ArrowRight } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { OptiMateSystemDemo } from "./optimate-system-demo";
import styles from "@/app/landing-v2/landing-v2.module.css";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const visualRef = useRef<HTMLDivElement | null>(null);
  const monitorRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const copy = copyRef.current;
    const visual = visualRef.current;
    const monitor = monitorRef.current;

    if (!section || !stage || !copy || !visual || !monitor) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 769px)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
          pin: stage,
          pinSpacing: false,
          invalidateOnRefresh: true,
        },
      });

      timeline
        // A: copy remains dominant. B/C: environment and complete monitor enter.
        .fromTo(visual, { yPercent: 96, scale: 0.985 }, { yPercent: 0, scale: 1, duration: 0.5, ease: "none" }, 0.2)
        .fromTo(monitor, { yPercent: 5, scale: 0.96 }, { yPercent: 0, scale: 1, duration: 0.34, ease: "none" }, 0.28)
        .to(copy, { yPercent: -26, autoAlpha: 0, duration: 0.34, ease: "none" }, 0.2)
        // D: a scroll-controlled hold gives the complete system time to be read.
        .to(visual, { yPercent: 0, duration: 0.18, ease: "none" }, 0.7)
        .to(monitor, { yPercent: 0, duration: 0.18, ease: "none" }, 0.7)
        // E: only the final portion releases the monitor to the following section.
        .to(visual, { yPercent: -12, scale: 0.978, duration: 0.12, ease: "none" }, 0.88)
        .to(monitor, { yPercent: -3, duration: 0.12, ease: "none" }, 0.88);
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} id="hero" className={styles.hero} aria-labelledby="hero-title">
      <div ref={stageRef} className={styles.heroStage}>
        <div ref={copyRef} className={styles.copy}>
          <p className={styles.eyebrow}>ИИ · программирование · интеграции · данные</p>
          <h1 id="hero-title">Ваш бизнес уже можно автоматизировать сильнее, чем вы думаете.</h1>
          <p className={styles.lead}>Убираем ручную работу, зависимость от «незаменимых» сотрудников и потерю данных — создавая интеллектуальные системы на базе ИИ, CRM, 1С, сайтов, баз данных и BI.</p>
          <div className={styles.actions}>
            <a className={styles.primaryAction} href="#system-demo">Показать, что можно автоматизировать <ArrowRight size={18} /></a>
            <a className={styles.secondaryAction} href="#hidden-cost">Узнать свои точки потерь</a>
          </div>
        </div>
        <div className={styles.heroVisualFrame} aria-label="Рабочая среда и система OptiMate">
          <div ref={visualRef} className={styles.heroVisual}>
            <div ref={monitorRef} className={styles.heroMonitor}>
              <div className={styles.monitorFrame}>
                <div className={styles.monitorScreenBezel}>
                  <div id="system-demo" className={styles.demoWrap}><OptiMateSystemDemo presentation="compact-landscape" /></div>
                </div>
                <div className={styles.monitorLowerEdge} aria-hidden="true"><span /></div>
              </div>
              <div className={styles.monitorStand} aria-hidden="true"><span /></div>
              <div className={styles.monitorBase} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
