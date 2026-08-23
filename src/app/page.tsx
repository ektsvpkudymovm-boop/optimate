import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { FAQ } from "@/components/public/faq";
import { OperationsProcessRail } from "@/components/public/operations-process-rail";
import { ProductionTelemetryBoard } from "@/components/public/production-telemetry-board";
import { ScrollSequenceHero } from "@/components/public/scroll-sequence-hero";
import { SystemPassportShowreel } from "@/components/public/system-passport-showreel";
import { capabilities } from "@/content/capabilities";
import { buildMetadata, PAGE_SEO } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(PAGE_SEO.home);

const ARCHITECTURE_LAYERS = [
  {
    label: "interface",
    title: "Рабочая поверхность",
    text: "CRM, кабинеты, админки, формы, PWA и панели для повторяющейся операционной работы.",
    tags: ["интерфейс", "формы", "панели"],
  },
  {
    label: "agents",
    title: "AI-роли",
    text: "Агенты, промпт-конфигурации, проверки, сценарии уточнения и ручное подтверждение.",
    tags: ["агенты", "проверки", "черновики"],
  },
  {
    label: "knowledge",
    title: "Знания и данные",
    text: "RAG, документы, каталоги, заявки, статусы, события и структура хранения.",
    tags: ["RAG", "документы", "статусы"],
  },
  {
    label: "automations",
    title: "Маршруты",
    text: "n8n, Make, API, webhooks, очереди, запасные сценарии и уведомления между сервисами.",
    tags: ["API", "очереди", "уведомления"],
  },
  {
    label: "analytics",
    title: "Наблюдаемость",
    text: "События, отчёты, журнал действий, права доступа и точки улучшения после запуска.",
    tags: ["журнал", "отчёты", "доступы"],
  },
  {
    label: "human control",
    title: "Контроль человека",
    text: "AI готовит черновики и решения к проверке, финальное действие остаётся у специалиста.",
    tags: ["контроль", "проверка", "решение"],
  },
];

const OPERATIONS_FLOW = [
  {
    action: "получена заявка",
    result: "контакт приведён к единому виду",
    status: "получено",
  },
  {
    action: "поиск по базе знаний",
    result: "ответ собран на основе источников",
    status: "собрано",
  },
  {
    action: "проверка человеком",
    result: "черновик ожидает подтверждения",
    status: "на контроле",
  },
  {
    action: "запуск сценария",
    result: "CRM обновлена, уведомление отправлено",
    status: "обновлено",
  },
  {
    action: "запись в журнал",
    result: "действие зафиксировано в системе",
    status: "записано",
  },
];

export default function HomePage() {
  const publicCapabilities = capabilities.filter((capability) => capability.id !== "web-interfaces").slice(0, 7);

  return (
    <div className="home-page">
      <ScrollSequenceHero sequenceMode="theme" />

      <section className="lab-section lab-section--void live-system-section ops-bg ops-bg--center">
        <div className="container typographic-scene typographic-scene--split">
          <div className="live-system-copy">
            <p className="lab-kicker">КУДА ВНЕДРИТЬ AI</p>
            <h2 className="lab-section__title">
              <span>Выберите участок бизнеса,</span>
              <span>где нужна система</span>
            </h2>
            <p className="lab-section__lead">
              Нажмите на задачу — покажем похожие кейсы: какие данные связали, что автоматизировали и где
              оставили контроль человеку.
            </p>
          </div>
          <div className="system-line-list system-line-list--live">
            {publicCapabilities.map((capability, index) => (
              <Link
                key={capability.id}
                href={`/work?type=${capability.id}#work-results`}
                className="system-line system-line--live"
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{capability.shortTitle}</strong>
                <em>{capability.systemParts.slice(0, 3).join(" / ")}</em>
                <span className="system-line__action" aria-hidden="true">
                  Смотреть кейсы
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SystemPassportShowreel />

      <section className="lab-section lab-section--void architecture-section ops-bg ops-bg--left">
        <div className="container typographic-scene typographic-scene--split architecture-section__grid">
          <div className="architecture-section__copy">
            <p className="lab-kicker">АРХИТЕКТУРА</p>
            <h2 className="lab-section__title">
              Операционный контур держится на слоях, а не на одном AI-скрипте
            </h2>
            <p className="lab-section__lead">
              Если выпадают данные, контроль или интерфейс оператора, AI превращается в демо.
              Поэтому мы проектируем систему целиком.
            </p>
          </div>

          <div className="architecture-layer-stack" aria-label="Слои рабочего контура">
            <div className="architecture-layer-stack__head">
              <span>СЛОИ РАБОЧЕГО КОНТУРА</span>
              <strong>СТЕК СЛОЁВ СИСТЕМЫ</strong>
            </div>
            <div className="architecture-layer-stack__rail" aria-hidden="true">
              <span />
            </div>
            {ARCHITECTURE_LAYERS.map((layer, index) => (
              <article
                key={layer.label}
                className="architecture-stack-row"
                role="group"
                tabIndex={0}
                aria-label={`${String(index + 1).padStart(2, "0")}. ${layer.title}`}
                style={{ "--layer-index": index } as CSSProperties}
              >
                <div className="architecture-stack-row__marker" aria-hidden="true">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="architecture-stack-row__body">
                  <div className="architecture-stack-row__title">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{layer.title}</h3>
                  </div>
                  <p>{layer.text}</p>
                  <div className="architecture-stack-row__tags" aria-label={`Метки слоя: ${layer.title}`}>
                    {layer.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lab-section lab-section--void production-manifest-section ops-bg ops-bg--right">
        <div className="container production-manifest">
          <div className="production-manifest__copy">
            <p className="lab-kicker">НЕ ДЕМО</p>
            <h2 className="lab-section__title">
              Система с ИИ должна выдержать реальные данные, ошибки и рост нагрузки
            </h2>
            <p className="lab-section__lead">
              Быстрая первая версия важна, но она не должна быть одноразовым скриптом. В контур входят
              права доступа, журнал действий, запасной сценарий, ручное подтверждение и мониторинг.
            </p>
          </div>
          <ProductionTelemetryBoard />
        </div>
        <div className="production-marquee" aria-label="Производственные признаки системы">
          <div className="production-marquee__track" aria-hidden="true">
            <span>API · БАЗЫ ДАННЫХ · ОЧЕРЕДИ · ЗАПАСНОЙ СЦЕНАРИЙ · КОНТРОЛЬ ЧЕЛОВЕКОМ · МОНИТОРИНГ · БЕЗОПАСНОСТЬ · ЖУРНАЛ ДЕЙСТВИЙ · ПРАВА ДОСТУПА · РЕЗЕРВНАЯ ОБРАБОТКА ·</span>
            <span>API · БАЗЫ ДАННЫХ · ОЧЕРЕДИ · ЗАПАСНОЙ СЦЕНАРИЙ · КОНТРОЛЬ ЧЕЛОВЕКОМ · МОНИТОРИНГ · БЕЗОПАСНОСТЬ · ЖУРНАЛ ДЕЙСТВИЙ · ПРАВА ДОСТУПА · РЕЗЕРВНАЯ ОБРАБОТКА ·</span>
          </div>
        </div>
      </section>

      <section className="lab-section lab-section--void operations-section ops-bg ops-bg--soft">
        <div className="container operations-split">
          <div className="operations-copy">
            <p className="lab-kicker">АВТОНОМНЫЙ БИЗНЕС-КОНТУР</p>
            <h2 className="lab-section__title">
              Днём команда управляет процессом. Ночью система продолжает его вести.
            </h2>
            <p className="lab-section__lead">
              Система принимает заявки, собирает данные, готовит ответы и черновики, обновляет CRM и фиксирует действия.
              Человек подключается там, где нужен контроль и решение.
            </p>
          </div>
          <OperationsProcessRail steps={OPERATIONS_FLOW} />
        </div>
      </section>

      <section className="lab-section lab-section--void final-cta-section ops-bg ops-bg--center">
        <div className="container final-lab-cta final-lab-cta--home">
          <p className="lab-kicker">НАЧНЁМ С ОДНОГО ПРОЦЕССА</p>
          <h2>Разберём один процесс и покажем, какую AI-систему стоит собрать первой</h2>
          <p>
            Опишите, где сейчас больше всего ручной работы: заявки, документы, CRM, контент, каталог, коммуникации или отчёты.
            Мы предложим 1–3 сценария с разным уровнем риска и сложности.
          </p>
          <Link href="/contacts" className="lab-action lab-action--primary">
            Получить разбор процесса
          </Link>
        </div>
      </section>

      <section className="lab-section lab-section--void faq-section ops-bg ops-bg--clean">
        <div className="container faq-console">
          <div className="faq-console__title">
            <p className="lab-kicker">FAQ</p>
            <h2>Часто задаваемые вопросы</h2>
          </div>
          <FAQ />
        </div>
      </section>
    </div>
  );
}
