"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  companyContextOutcomes,
  companyContextSources,
  type CompanyContextSourceId,
} from "./company-context-data";
import styles from "@/app/landing-v2/landing-v2.module.css";

const finalStatement = "И всё это начинает не просто храниться, а работать.";
const finalStatementHighlightedWord = "храниться";

const revealBaseDelayMs = 320;
const revealStepMs = 470;
const outcomesRevealDelayMs = 520;
const conclusionRevealDelayMs = 1060;

const classNames = (...values: Array<string | false | null | undefined>): string =>
  values.filter(Boolean).join(" ");

export function CompanyContextSection() {
  const [activeSourceId, setActiveSourceId] = useState<CompanyContextSourceId>(
    companyContextSources[0]?.id ?? "customers",
  );
  const [visibleSourceCount, setVisibleSourceCount] = useState(0);
  const [outcomesVisible, setOutcomesVisible] = useState(false);
  const [conclusionVisible, setConclusionVisible] = useState(false);

  const revealTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const sectionRef = useRef<HTMLElement | null>(null);
  const hasPlaybackStarted = useRef(false);

  const clearRevealTimers = useCallback(() => {
    revealTimers.current.forEach((timer) => clearTimeout(timer));
    revealTimers.current = [];
  }, []);

  const isReducedMotion = useCallback(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const revealEverything = useCallback(
    (selectedId: CompanyContextSourceId) => {
      clearRevealTimers();
      setVisibleSourceCount(companyContextSources.length);
      setOutcomesVisible(true);
      setConclusionVisible(true);
      setActiveSourceId(selectedId);
      hasPlaybackStarted.current = true;
    },
    [clearRevealTimers],
  );

  const sourceCount = companyContextSources.length;

  const startReveal = useCallback(() => {
    if (hasPlaybackStarted.current) return;
    hasPlaybackStarted.current = true;

    if (isReducedMotion()) {
      revealEverything(companyContextSources[0]?.id ?? "customers");
      return;
    }

    clearRevealTimers();
    setVisibleSourceCount(0);
    setOutcomesVisible(false);
    setConclusionVisible(false);
    setActiveSourceId(companyContextSources[0]?.id ?? "customers");

    companyContextSources.forEach((source, index) => {
      revealTimers.current.push(
        setTimeout(() => {
          setVisibleSourceCount(index + 1);
          setActiveSourceId(source.id);
        }, revealBaseDelayMs + index * revealStepMs),
      );
    });

    const timeoutOffset = revealBaseDelayMs + sourceCount * revealStepMs;
    revealTimers.current.push(
      setTimeout(() => setOutcomesVisible(true), timeoutOffset + outcomesRevealDelayMs),
    );
    revealTimers.current.push(
      setTimeout(() => setConclusionVisible(true), timeoutOffset + conclusionRevealDelayMs),
    );
  }, [clearRevealTimers, isReducedMotion, revealEverything, sourceCount]);

  const handleSourceClick = useCallback(
    (sourceId: CompanyContextSourceId) => {
      revealEverything(sourceId);
    },
    [revealEverything],
  );

  const isSourceVisible = (index: number, reducedMotion: boolean) =>
    reducedMotion || index < visibleSourceCount;

  const isSourceActive = (sourceId: CompanyContextSourceId, activeSourceId: CompanyContextSourceId) =>
    sourceId === activeSourceId;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries.at(0);
        if (!entry) return;

        if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
          startReveal();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      clearRevealTimers();
    };
  }, [clearRevealTimers, startReveal]);

  const reducedMotion = isReducedMotion();
  const activeSource = companyContextSources.find((source) => source.id === activeSourceId) ??
    companyContextSources[0];

  return (
    <section
      id="company-context"
      ref={sectionRef}
      className={styles.companyContextSection}
      aria-labelledby="company-context-title"
      aria-describedby="company-context-conclusion"
    >
      <div className={styles.companyContextContainer}>
        <ContextHeader />

        <div className={styles.companyContextSourceSelector}>
          <p className={styles.companyContextSourceIntro}>РАЗРОЗНЕННЫЕ ФАКТЫ ОДНОЙ СИТУАЦИИ</p>

          <div className={styles.companyContextSourceBand} role="tablist" aria-label="Источники ситуации">
            {companyContextSources.map((source, index) => (
              <button
                key={source.id}
                type="button"
                role="tab"
                aria-selected={isSourceActive(source.id, activeSourceId)}
                aria-controls="company-context-core-rows"
                onClick={() => handleSourceClick(source.id)}
                className={classNames(
                  styles.companyContextSource,
                  isSourceVisible(index, reducedMotion) ? styles.companyContextSourceVisible : null,
                  isSourceActive(source.id, activeSourceId) ? styles.companyContextSourceActive : null,
                )}
              >
                <p className={styles.companyContextSourceMeta}>
                  <span className={styles.companyContextSourceIndex} aria-hidden>
                    {source.index}
                  </span>
                  <span className={styles.companyContextSourceName}>{source.title}</span>
                </p>
                <p className={styles.companyContextSourceFact}>{source.fact}</p>
                <p className={styles.companyContextSourceSecondary}>{source.secondary}</p>
              </button>
            ))}
          </div>

          <div className={styles.companyContextSourceRail} role="tablist" aria-label="Источники ситуации (мобильный)">
                {companyContextSources.map((source) => (
              <button
                key={`rail-${source.id}`}
                type="button"
                role="tab"
                aria-selected={isSourceActive(source.id, activeSourceId)}
                onClick={() => handleSourceClick(source.id)}
                className={classNames(
                  styles.companyContextSourceRailButton,
                  isSourceActive(source.id, activeSourceId)
                    ? styles.companyContextSourceActive
                    : null,
                )}
              >
                <span className={styles.companyContextSourceIndex}>{source.index}</span>
                <span>{source.title}</span>
              </button>
            ))}
          </div>

          {activeSource ? (
            <article className={styles.companyContextMobileSourcePanel} aria-live="polite">
              <p className={styles.companyContextSourceName}>{activeSource.title}</p>
              <p className={styles.companyContextSourceFact}>{activeSource.fact}</p>
              <p className={styles.companyContextSourceSecondary}>{activeSource.secondary}</p>
              <div className={styles.companyContextMobileConnectorLine} aria-hidden="true" />
            </article>
          ) : null}
        </div>

        <section className={styles.companyContextUnifiedContext} aria-labelledby="company-context-unified-title">
          <p className={styles.companyContextContextEyebrow}>Единый контекст компании</p>
          <h3 id="company-context-unified-title" className={styles.companyContextContextTitle}>
            Одна ситуация становится понятной целиком.
          </h3>
          <p className={styles.companyContextContextDescription}>
            Каждая часть компании знает только свой фрагмент. Вместе они превращаются в рабочий контекст.
          </p>

          <div id="company-context-core-rows" className={styles.companyContextContextRows}>
            {companyContextSources.map((source, index) => (
              <article
                key={source.id}
                className={classNames(
                  styles.companyContextContextRow,
                  isSourceVisible(index, reducedMotion) ? styles.companyContextContextRowVisible : null,
                  isSourceActive(source.id, activeSourceId)
                    ? styles.companyContextContextRowActive
                    : null,
                )}
              >
                <p className={styles.companyContextContextRowLabel}>{source.contextLabel}</p>
                <p className={styles.companyContextContextRowText}>{source.contextText}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          className={classNames(
            styles.companyContextOutcomeWrap,
            outcomesVisible || reducedMotion ? styles.companyContextVisible : null,
          )}
          aria-labelledby="company-context-outcomes-title"
        >
          <h3 id="company-context-outcomes-title" className={styles.companyContextOutcomeTitle}>
            Контекст превращается в действие
          </h3>
          <p className={styles.companyContextOutcomeCopy}>
            Не новый отчёт и не ещё одна база. Один собранный контекст даёт понятный следующий шаг конкретной роли.
          </p>
          <div className={styles.companyContextOutcomeGrid}>
            {companyContextOutcomes.map((outcome) => (
              <div key={outcome.role} className={styles.companyContextOutcomeItem}>
                <p className={styles.companyContextOutcomeRole}>{outcome.role}</p>
                <p className={styles.companyContextOutcomeValue}>→ {outcome.outcome}</p>
              </div>
            ))}
          </div>
        </section>

        <p
          id="company-context-conclusion"
          className={classNames(
            styles.companyContextConclusion,
            conclusionVisible || reducedMotion ? styles.companyContextVisible : null,
          )}
          aria-live="polite"
        >
          {finalStatement.split(finalStatementHighlightedWord).map((part, index, parts) => (
            <span key={`${finalStatementHighlightedWord}-${index}`}>
              {part}
              {index < parts.length - 1 ? (
                <span className={styles.companyContextConclusionAccent}>{finalStatementHighlightedWord}</span>
              ) : null}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

function ContextHeader() {
  return (
    <header className={styles.companyContextHeader}>
      <p className={styles.companyContextKicker}>Главная идея</p>
      <h2 id="company-context-title" className={styles.companyContextHeadline}>
        Представьте, что компания наконец-то «знает всё о себе».
      </h2>
    </header>
  );
}
