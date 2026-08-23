"use client";

import { ArrowRight, Check, Database, Search } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { callCapabilities, knowledgeModes, marketModes } from "./landing-v2-data";
import styles from "@/app/landing-v2/landing-v2.module.css";

const join = (...values: Array<string | false | undefined>) => values.filter(Boolean).join(" ");

export function ProductStoryChapter() {
  const rootRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [entryReady, setEntryReady] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const revealEntry = () => {
      if (root.getBoundingClientRect().top < window.innerHeight * 0.9) setEntryReady(true);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setEntryReady(true);
      },
      { threshold: 0.14 },
    );

    observer.observe(root);
    window.addEventListener("scroll", revealEntry, { passive: true });
    revealEntry();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", revealEntry);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!root || !stage || !track) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(min-width: 1025px) and (prefers-reduced-motion: no-preference)", () => {
      const sources = root.querySelectorAll<HTMLElement>("[data-story-source]");
      const focus = root.querySelectorAll<HTMLElement>("[data-story-focus]");
      const actions = root.querySelectorAll<HTMLElement>("[data-story-action]");
      const phrases = root.querySelectorAll<HTMLElement>("[data-story-phrase]");
      const getDistance = () => Math.max(0, track.scrollWidth - stage.clientWidth);

      const context = gsap.context(() => {
        gsap.set([...sources, ...focus, ...actions, ...phrases], { autoAlpha: 0, y: 16 });
        gsap.set(track, { x: 0 });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * 3.1)}`,
            pin: stage,
            pinSpacing: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              root.style.setProperty("--product-story-progress", self.progress.toFixed(3));
              root.dataset.storyScene = self.progress < 0.33 ? "04" : self.progress < 0.68 ? "05" : "06";
            },
          },
        });

        timeline
          .to(sources, { autoAlpha: 1, y: 0, duration: 0.22, stagger: 0.08 }, 0)
          .to({}, { duration: 0.38 })
          .to(track, { x: () => -getDistance() / 2, duration: 0.58 })
          .to(focus, { autoAlpha: 1, y: 0, duration: 0.16, stagger: 0.08 }, "<+=0.12")
          .to(actions, { autoAlpha: 1, y: 0, duration: 0.16, stagger: 0.06 }, ">-=0.04")
          .to({}, { duration: 0.28 })
          .to(track, { x: () => -getDistance(), duration: 0.58 })
          .to(phrases, { autoAlpha: 1, y: 0, duration: 0.16, stagger: 0.1 }, "<+=0.12")
          .to({}, { duration: 0.38 });
      }, root);

      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  useEffect(() => {
    if (!entryReady) return;

    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 760);
    return () => window.clearTimeout(refreshTimer);
  }, [entryReady]);

  return (
    <section
      ref={rootRef}
      className={join(styles.productStoryChapter, entryReady && styles.productStoryEntryReady)}
      aria-label="Продуктовая история: знания, разговоры и рынок"
    >
      <div ref={stageRef} className={styles.productStorySticky}>
        <nav className={styles.productStoryProgress} aria-label="Сцены продуктовой истории">
          <span><b>01</b> Знания</span>
          <span><b>02</b> Разговоры</span>
          <span><b>03</b> Рынок</span>
        </nav>

        <div ref={trackRef} className={styles.productStoryTrack}>
          <KnowledgeScene />
          <ConversationScene />
          <MarketScene />
        </div>
      </div>
    </section>
  );
}

function KnowledgeScene() {
  const [activeMode, setActiveMode] = useState("sales");
  const mode = knowledgeModes.find((item) => item.id === activeMode) ?? knowledgeModes[1];

  return (
    <article className={join(styles.productStoryScene, styles.productKnowledgeScene)} aria-labelledby="knowledge-title">
      <div className={styles.productSceneNumber}>04 <span>Knowledge</span></div>
      <div className={styles.knowledgeStatement}>
        <p className={styles.productSceneKicker}>ИИ-Википедия компании</p>
        <h2 id="knowledge-title">Сотрудник больше не ищет ответ по системам. Он задаёт вопрос.</h2>
        <p>Единый интеллектуальный источник знает вашу компанию и помогает сотрудникам работать быстрее.</p>
      </div>

      <div className={styles.knowledgeProduct}>
        <div className={styles.knowledgeQuestion}>
          <span><Search size={16} /> Вопрос сотрудника</span>
          <strong>Какой аналог предложить клиенту вместо X?</strong>
        </div>
        <div className={styles.knowledgeAnswer}>
          <span><Check size={15} /> Объяснимый ответ</span>
          <h3>Есть несколько подходящих аналогов</h3>
          <p>Система сравнивает назначение, характеристики и условия продажи — затем даёт менеджеру объяснимый вариант ответа.</p>
          <div className={styles.knowledgeNextAction}><small>Следующее действие</small><b>Подготовить предложение <ArrowRight size={15} /></b></div>
        </div>
        <div className={styles.knowledgeSourceField}>
          <p><Database size={14} /> Источники сходятся к ответу</p>
          <div>
            {["CRM", "1С", "Каталог", "Документы"].map((source, index) => (
              <span key={source} data-story-source style={{ "--source-index": index } as CSSProperties}>{source}</span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.knowledgeModeBlock}>
        <div className={styles.productSelectorLabel}>Режим знания</div>
        <div className={styles.productModeRail} role="tablist" aria-label="Сценарии ИИ-Википедии">
          {knowledgeModes.map((item) => <button key={item.id} type="button" role="tab" aria-selected={item.id === mode.id} onClick={() => setActiveMode(item.id)}>{item.label}</button>)}
        </div>
        <p>{mode.copy}</p>
      </div>
    </article>
  );
}

function ConversationScene() {
  const [capability, setCapability] = useState(0);
  const focus = [["Потребность", "Аналог под задачу клиента"], ["Возражение", "Срок и доступность"], ["Договорённость", "Подготовить варианты"], ["Следующий шаг", "Отправить предложение"]];

  return (
    <article className={join(styles.productStoryScene, styles.productConversationScene)} aria-labelledby="calls-title">
      <div className={styles.productSceneNumber}>05 <span>Conversation</span></div>
      <div className={styles.conversationIntro}>
        <p className={styles.productSceneKicker}>Анализ разговоров</p>
        <h2 id="calls-title">Из разговора система достаёт то, что важно бизнесу.</h2>
      </div>
      <blockquote className={styles.conversationQuote}>«Нужна похожая позиция, но в другом исполнении.»</blockquote>
      <div className={styles.conversationFocus}>
        <p>Разговор <span>12:41</span></p>
        <div>
          {focus.map(([label, value]) => <article key={label} data-story-focus><span>{label}</span><b>{value}</b></article>)}
        </div>
      </div>
      <div className={styles.conversationActionRail}>
        {['Саммари готово', 'CRM обновлена', 'Задача создана', 'Рекомендация менеджеру'].map((action) => <p key={action} data-story-action><Check size={14} /> {action}</p>)}
      </div>
      <div className={styles.conversationCapabilityBlock}>
        <div className={styles.productSelectorLabel}>Фокус системы</div>
        <div className={styles.productModeRail} role="tablist" aria-label="Возможности анализа разговоров">
          {callCapabilities.map((item, index) => <button key={item.title} type="button" role="tab" aria-selected={index === capability} onClick={() => setCapability(index)}>{item.title}</button>)}
        </div>
        <p>{callCapabilities[capability].copy}</p>
      </div>
    </article>
  );
}

function MarketScene() {
  const [selected, setSelected] = useState("procurement");
  const mode = marketModes.find((item) => item.id === selected) ?? marketModes[0];
  const phrases = ["Нужна похожая позиция…", "Есть вариант для той же задачи?..", "Пока закрываем сторонним решением…"];

  return (
    <article className={join(styles.productStoryScene, styles.productMarketScene)} aria-labelledby="market-title">
      <div className={styles.productSceneNumber}>06 <span>Market intelligence</span></div>
      <div className={styles.marketIntro}>
        <p className={styles.productSceneKicker}>Данные о рынке</p>
        <h2 id="market-title">Клиенты уже говорят, что им нужно.</h2>
        <p>Множество коммуникаций превращаются в управленческий сигнал.</p>
      </div>
      <div className={styles.marketPhrases} aria-label="Повторяющиеся клиентские формулировки">
        {phrases.map((phrase) => <p key={phrase} data-story-phrase>«{phrase}»</p>)}
      </div>
      <div className={styles.marketSignal}>
        <span>Повторяющийся сигнал</span>
        <h3>{mode.title}</h3>
        <p>{mode.copy}</p>
      </div>
      <div className={styles.marketModeBlock}>
        <div className={styles.productSelectorLabel}>Управленческий взгляд</div>
        <div className={styles.productModeRail} role="tablist" aria-label="Направления анализа рынка">
          {marketModes.map((item) => <button key={item.id} type="button" role="tab" aria-selected={item.id === mode.id} onClick={() => setSelected(item.id)}>{item.label}</button>)}
        </div>
      </div>
    </article>
  );
}
