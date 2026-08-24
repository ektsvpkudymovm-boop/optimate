"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pipelineSteps } from "./landing-v2-data";
import styles from "@/app/landing-v2/landing-v2.module.css";

const sourceSystems = [
  { short: "CRM", label: "CRM", detail: "клиенты и сделки", className: "sourceCrm" },
  { short: "1С", label: "1С", detail: "операции и учёт", className: "sourceOneC" },
  { short: "CALL", label: "Звонки", detail: "разговоры и сигналы", className: "sourceCalls" },
  { short: "DOC", label: "Документы", detail: "договоры и файлы", className: "sourceDocs" },
  { short: "WEB", label: "Сайт", detail: "заявки и поведение", className: "sourceWeb" },
  { short: "DB", label: "Базы", detail: "справочники и архив", className: "sourceDb" },
] as const;

const join = (...values: Array<string | undefined>) => values.filter(Boolean).join(" ");

export function AutomationArchitectureSection() {
  const rootRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(min-width: 769px) and (prefers-reduced-motion: no-preference)", () => {
      const intro = root.querySelector<HTMLElement>("[data-architecture-intro]");
      const lead = root.querySelector<HTMLElement>("[data-architecture-lead]");
      const world = root.querySelector<HTMLElement>("[data-architecture-world]");
      const sources = Array.from(root.querySelectorAll<HTMLElement>("[data-architecture-source]"));
      const dataLayer = root.querySelector<HTMLElement>("[data-architecture-data]");
      const intelligence = root.querySelector<HTMLElement>("[data-architecture-ai]");
      const actions = Array.from(root.querySelectorAll<HTMLElement>("[data-architecture-action]"));
      const actionLayer = root.querySelector<HTMLElement>("[data-architecture-action-layer]");
      const analytics = root.querySelector<HTMLElement>("[data-architecture-analytics]");
      const signal = root.querySelector<HTMLElement>("[data-architecture-signal]");
      const loop = root.querySelector<HTMLElement>("[data-architecture-loop]");
      const finalStatement = root.querySelector<HTMLElement>("[data-architecture-final]");

      if (!intro || !lead || !world || !dataLayer || !intelligence || !actionLayer || !analytics || !signal || !loop || !finalStatement) return;

      let cleanupTimeline = () => undefined;
      const context = gsap.context(() => {
        gsap.set(world, { autoAlpha: 0, scale: 1.2, clipPath: "inset(0 0 0 18%)", transformOrigin: "50% 52%" });
        gsap.set(sources, { autoAlpha: 0, scale: 1.34, z: 170, transformOrigin: "50% 50%" });
        gsap.set([dataLayer, intelligence, actionLayer, analytics, loop, finalStatement], { autoAlpha: 0, y: 14 });
        gsap.set(actions, { autoAlpha: 0, x: -14 });
        gsap.set(signal, { autoAlpha: 0, scaleX: 0, transformOrigin: "0% 50%" });

        const timeline = gsap.timeline({ defaults: { ease: "none" }, paused: true });

        timeline
          .to(intro, { scale: 0.76, yPercent: -58, transformOrigin: "0% 0%", duration: 0.68 }, 0.38)
          .to(lead, { autoAlpha: 0.74, duration: 0.34 }, 0.48)
          .to(world, { autoAlpha: 1, duration: 0.2 }, 0.74)
          .to(sources, { autoAlpha: 1, scale: 1, z: 0, duration: 0.32, stagger: 0.24 }, 0.9)
          .to(world, { clipPath: "inset(0 0 0 0%)", duration: 0.34 }, 1.88)
          .to(world, { scale: 0.84, yPercent: 6, duration: 0.7 }, 2.06)
          .to(dataLayer, { autoAlpha: 1, y: 0, duration: 0.28 }, 2.45)
          .to(intelligence, { autoAlpha: 1, y: 0, duration: 0.3 }, 2.76)
          .to(signal, { autoAlpha: 1, scaleX: 1, duration: 0.46 }, 2.95)
          .to(actionLayer, { autoAlpha: 1, y: 0, duration: 0.24 }, 3.25)
          .to(actions, { autoAlpha: 1, x: 0, duration: 0.22, stagger: 0.1 }, 3.44)
          .to(analytics, { autoAlpha: 1, y: 0, duration: 0.3 }, 3.96)
          .to(loop, { autoAlpha: 1, y: 0, duration: 0.3 }, 4.18)
          .to(finalStatement, { autoAlpha: 1, y: 0, duration: 0.22 }, 4.42);

        let frame = 0;
        const syncProgress = () => {
          frame = 0;
          const start = root.offsetTop;
          const distance = Math.max(1, root.offsetHeight - window.innerHeight);
          const progress = Math.min(1, Math.max(0, (window.scrollY - start) / distance));
          timeline.progress(progress);
        };
        const requestSync = () => {
          if (!frame) frame = window.requestAnimationFrame(syncProgress);
        };
        const master = ScrollTrigger.create({
          trigger: root,
          start: () => root.offsetTop,
          end: () => root.offsetTop + Math.max(1, root.offsetHeight - window.innerHeight),
          invalidateOnRefresh: true,
          onRefresh: requestSync,
          onUpdate: requestSync,
        });

        window.addEventListener("scroll", requestSync, { passive: true });
        window.addEventListener("resize", requestSync);
        requestSync();

        cleanupTimeline = () => {
          window.removeEventListener("scroll", requestSync);
          window.removeEventListener("resize", requestSync);
          if (frame) window.cancelAnimationFrame(frame);
          master.kill();
        };
      }, root);

      return () => {
        cleanupTimeline();
        context.revert();
      };
    });

    media.add("(max-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const intro = root.querySelector<HTMLElement>("[data-architecture-intro]");
      const flow = root.querySelector<HTMLElement>("[data-architecture-mobile-flow]");
      const sources = Array.from(root.querySelectorAll<HTMLElement>("[data-architecture-mobile-source]"));
      const signal = root.querySelector<HTMLElement>("[data-architecture-mobile-signal]");
      const stages = Array.from(root.querySelectorAll<HTMLElement>("[data-architecture-mobile-stage]"));
      const finalStatement = root.querySelector<HTMLElement>("[data-architecture-mobile-final]");
      if (!intro || !flow || !signal || !finalStatement) return;

      const context = gsap.context(() => {
        gsap.set([...sources, signal, ...stages, finalStatement], { autoAlpha: 0, y: 12 });
        gsap.set(signal, { scaleY: 0, transformOrigin: "50% 0%" });
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: root, start: "top 70%", end: "bottom 55%", scrub: 0.55, invalidateOnRefresh: true },
        });
        timeline
          .from(intro, { autoAlpha: 0, y: 12, duration: 0.25, ease: "none" })
          .to(sources, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.1, ease: "none" })
          .to(signal, { autoAlpha: 1, y: 0, scaleY: 1, duration: 0.22, ease: "none" })
          .to(stages, { autoAlpha: 1, y: 0, duration: 0.46, stagger: 0.18, ease: "none" })
          .to(finalStatement, { autoAlpha: 1, y: 0, duration: 0.25, ease: "none" });
      }, root);
      return () => context.revert();
    });

    // The preceding horizontal chapter creates its pin spacer after mount.
    // Refresh once it has settled so this scene starts exactly after Block 06.
    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 980);
    return () => {
      window.clearTimeout(refreshTimer);
      media.revert();
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !window.matchMedia("(min-width: 769px)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) ScrollTrigger.refresh();
      },
      { rootMargin: "100% 0px 0px" },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={rootRef} className={styles.architectureSection} aria-labelledby="architecture-title">
      <div className={styles.architectureStage}>
        <div className={join(styles.v2Container, styles.architectureContainer)}>
          <header className={styles.architectureIntro} data-architecture-intro>
            <p className={styles.sectionKicker}>Не только два продукта</p>
            <h2 id="architecture-title">Мы не продаём «ИИ ради ИИ». Мы автоматизируем процессы, которые стоят бизнесу времени и денег.</h2>
            <p data-architecture-lead>Объединяем ИИ, программирование, интеграции и данные в индивидуальные системы.</p>
          </header>

          <div className={styles.architectureWorld} data-architecture-world aria-hidden="true">
            <div className={styles.architectureCoordinate} />
            <div className={styles.architectureSourceField}>
              {sourceSystems.map((source) => (
                <div key={source.short} className={join(styles.architectureSource, styles[source.className])} data-architecture-source>
                  <span>{source.short}</span>
                  <b>{source.label}</b>
                  <small>{source.detail}</small>
                </div>
              ))}
              <div className={styles.architectureDataLayer} data-architecture-data>
                <span>01 / Данные</span>
                <p>CRM, 1С, сайт, звонки, документы, базы.</p>
              </div>
            </div>

            <div className={styles.architectureIntelligence} data-architecture-ai>
              <span>02 / ИИ</span>
              <strong>Анализ · поиск<br />классификация · генерация</strong>
              <i>поле интерпретации</i>
            </div>
            <div className={styles.architectureSignal} data-architecture-signal />

            <div className={styles.architectureActionLayer} data-architecture-action-layer>
              <span>03 / Действие</span>
              <p>Обновление CRM, задача, отчёт или публикация.</p>
              <div className={styles.architectureActions}>
                <b data-architecture-action>CRM обновлена</b>
                <b data-architecture-action>Задача создана</b>
                <b data-architecture-action>Отчёт подготовлен</b>
              </div>
            </div>

            <div className={styles.architectureAnalytics} data-architecture-analytics>
              <span>04 / Аналитика</span>
              <strong>BI<br />обратная связь<br />улучшение процесса</strong>
            </div>
            <div className={styles.architectureLoop} data-architecture-loop>↺ <span>сигнал обратно в процесс</span></div>
          </div>

          <p className={styles.architectureFinalStatement} data-architecture-final><span>Единая система бизнеса</span>Источники → понимание → действие → улучшение</p>

          <div className={styles.architectureMobileFlow} data-architecture-mobile-flow>
            <div className={styles.architectureMobileSources}>
              {sourceSystems.map((source) => <span key={source.short} data-architecture-mobile-source>{source.label}</span>)}
            </div>
            <div className={styles.architectureMobileSignal} data-architecture-mobile-signal aria-hidden="true" />
            <ol aria-label="Как работает единая бизнес-система">
              {pipelineSteps.map((step, index) => (
                <li key={step.number} data-architecture-mobile-stage>
                  <span>{step.number}</span>
                  <div><h3>{step.title}</h3><p>{step.copy}</p></div>
                  {index === pipelineSteps.length - 1 && <b aria-hidden="true">↺</b>}
                </li>
              ))}
            </ol>
            <p className={styles.architectureMobileFinal} data-architecture-mobile-final>Источники → понимание → действие → улучшение</p>
          </div>
        </div>
      </div>
    </section>
  );
}
