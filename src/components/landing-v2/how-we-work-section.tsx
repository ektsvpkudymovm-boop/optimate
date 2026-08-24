"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { workSteps } from "./landing-v2-data";
import styles from "@/app/landing-v2/landing-v2.module.css";

const processLabels = ["analysis", "losses", "design", "implementation"];

export function HowWeWorkSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(max-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const statement = section.querySelector<HTMLElement>("[data-work-statement]");
      const steps = Array.from(section.querySelectorAll<HTMLElement>("[data-work-step]"));
      const progress = section.querySelector<HTMLElement>("[data-work-progress]");
      if (!statement || !progress) return;

      const context = gsap.context(() => {
        gsap.set(progress, { scaleY: 0, transformOrigin: "50% 0%" });
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: section, start: "top 72%", end: "bottom 62%", scrub: 0.5, invalidateOnRefresh: true },
        });
        timeline
          .from(statement, { autoAlpha: 0, y: 12, duration: 0.28, ease: "none" })
          .to(progress, { scaleY: 1, duration: 0.9, ease: "none" }, "<")
          .from(steps, { autoAlpha: 0, y: 10, duration: 0.65, stagger: 0.18, ease: "none" }, "<+=0.14");
      }, section);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.workSection} aria-labelledby="work-title">
      <div className={styles.v2Container}>
        <div className={styles.workLayout}>
          <header className={styles.workStatement} data-work-statement>
            <p className={styles.sectionKicker}>Как работаем</p>
            <h2 id="work-title">Не начинаем с технологии. Начинаем с вашей задачи.</h2>
            <p>Процесс остаётся прозрачным на каждом этапе — от первого разбора до работающей системы.</p>
          </header>
          <div className={styles.workProcess}>
            <div className={styles.workProgressLine} aria-hidden="true"><span className={styles.workProgressActive} data-work-progress /></div>
            <ol className={styles.workTimeline}>
              {workSteps.map((step, index) => (
                <li key={step.number} data-work-step>
                  <span>{step.number}</span>
                  <div>
                    <em>{step.number} / {processLabels[index]}</em>
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
