"use client";

import { useEffect, useRef, useState } from "react";

const AUDIT_ROWS = [
  "роль проверена",
  "персональные данные скрыты",
  "история действий сохранена",
  "доступ подтверждён",
];

const LOAD_STEPS = ["заявка", "CRM", "обработка", "аналитика", "результат"];

export function ProductionTelemetryBoard() {
  const boardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const board = boardRef.current;

    if (!board) return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotionQuery.matches) {
      const frame = window.requestAnimationFrame(() => setIsVisible(true));

      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.24 },
    );

    observer.observe(board);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={boardRef}
      className={`production-telemetry${isVisible ? " is-visible" : ""}`}
      aria-label="Панель контроля системы"
    >
      <div className="production-telemetry__header">
        <div>
          <span>Панель контроля системы</span>
          <strong>Как система держит процесс</strong>
        </div>
        <em>в работе</em>
      </div>

      <div className="production-telemetry__grid">
        <article className="telemetry-panel telemetry-panel--load">
          <div className="telemetry-panel__topline">
            <span>Нагрузка</span>
            <em>стабильно</em>
          </div>
          <strong className="telemetry-panel__metric">поток задач под контролем</strong>
          <p>заявки · CRM · обработка · аналитика · результат</p>
          <div className="telemetry-task-flow" aria-hidden="true">
            <div className="telemetry-task-flow__rail">
              <span className="telemetry-task-flow__packet telemetry-task-flow__packet--one" />
              <span className="telemetry-task-flow__packet telemetry-task-flow__packet--two" />
              <span className="telemetry-task-flow__packet telemetry-task-flow__packet--three" />
            </div>
            <ol className="telemetry-task-flow__steps">
              {LOAD_STEPS.map((step) => (
                <li key={step}>
                  <span />
                  <em>{step}</em>
                </li>
              ))}
            </ol>
          </div>
        </article>

        <article className="telemetry-panel telemetry-panel--queue">
          <div className="telemetry-panel__topline">
            <span>Очередь и запасной сценарий</span>
            <em>работает</em>
          </div>
          <strong className="telemetry-panel__metric">повторная обработка</strong>
          <p>ошибки уходят в резервный сценарий</p>
          <div className="telemetry-retry" aria-hidden="true">
            <div className="telemetry-retry__symbol">
              <span className="telemetry-retry__ring" />
              <span className="telemetry-retry__fail">×</span>
              <span className="telemetry-retry__arrow">↻</span>
              <span className="telemetry-retry__done">✓</span>
            </div>
            <div className="telemetry-retry__steps">
              <span>тест</span>
              <span>повтор</span>
              <span>готово</span>
            </div>
          </div>
        </article>

        <article className="telemetry-panel telemetry-panel--review">
          <div className="telemetry-panel__topline">
            <span>Проверка человеком</span>
            <em>под контролем</em>
          </div>
          <div className="telemetry-review">
            <div className="telemetry-human-flow" aria-hidden="true">
              <div className="telemetry-human-flow__card telemetry-human-flow__card--draft">
                <span />
                <strong>черновик</strong>
              </div>
              <i />
              <div className="telemetry-human-flow__person">
                <span />
                <em>проверка</em>
              </div>
              <i />
              <div className="telemetry-human-flow__card telemetry-human-flow__card--done">
                <span>✓</span>
                <strong>подтверждено</strong>
              </div>
            </div>
            <div className="telemetry-review__copy">
              <strong>рутина закрывается автоматически</strong>
              <span>сложные случаи уходят специалисту</span>
            </div>
          </div>
        </article>

        <article className="telemetry-panel telemetry-panel--audit">
          <div className="telemetry-panel__topline">
            <span>Безопасность и журнал</span>
            <em>проверено</em>
          </div>
          <ul className="telemetry-log" aria-label="События безопасности и журнала">
            {AUDIT_ROWS.map((row) => (
              <li key={row}>
                <span className="telemetry-log__dot" />
                <span className="telemetry-log__label">{row}</span>
                <span className="telemetry-log__check">✓</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  );
}
