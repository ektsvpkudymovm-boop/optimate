import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { capabilities, WORK_FILTERS } from "@/content/capabilities";
import { type CapabilityId, type Case, cases } from "@/content/cases";
import { buildMetadata, PAGE_SEO } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(PAGE_SEO.work);

type WorkPageProps = {
  searchParams: Promise<{ type?: string | string[] }>;
};

function isCapabilityId(value: string | undefined): value is CapabilityId {
  return WORK_FILTERS.some((filter) => filter.value === value && filter.value !== "all");
}

function getFilterHref(value: CapabilityId | "all") {
  return value === "all" ? "/work#work-results" : `/work?type=${value}#work-results`;
}

function listPreview(items: string[] | undefined, limit = 3) {
  const values = items?.filter(Boolean).slice(0, limit) ?? [];
  return values.length > 0 ? values : [];
}

function stackPreview(item: Case, limit = 5) {
  return listPreview(item.integrations.length > 0 ? item.integrations : item.stack, limit);
}

function getPublicStatus(status: string) {
  if (status === "MVP → Production") {
    return "Первая версия → внедрение";
  }

  return status
    .replaceAll("MVP", "Первая версия")
    .replaceAll("Production", "В работе");
}

function PassportCard({
  item,
  index,
  capabilityLabels,
}: {
  item: Case;
  index: number;
  capabilityLabels: Map<CapabilityId, string>;
}) {
  const buildHighlights = listPreview(item.automationHighlights, 3);
  const architectureHighlights = listPreview(item.architectureHighlights, 2);
  const stackItems = stackPreview(item, 5);
  const detailBlocks = [
    { label: "Бизнес-ситуация", value: item.businessProblem },
    { label: "Что собрали", value: buildHighlights.join(" / ") },
    { label: "Как работает контур", value: architectureHighlights.join(" / ") },
    { label: "Технологии и интеграции", value: stackItems.join(", ") },
  ].filter((block) => block.value);

  return (
    <Link
      href={`/cases/${item.slug}`}
      className="work-passport-card"
      aria-label={`Открыть кейс: ${item.clientTitle}`}
    >
      <div className="work-passport-card__topline">
        <span>{String(index + 1).padStart(2, "0")} / Кейс</span>
        <strong>{getPublicStatus(item.status)}</strong>
      </div>

      <div className="work-passport-card__capabilities" aria-label="Типы задач">
        {item.relatedCapabilities.slice(0, 3).map((capability) => (
          <span key={capability}>{capabilityLabels.get(capability) ?? capability}</span>
        ))}
      </div>

      <h3 className="work-passport-card__title">{item.clientTitle}</h3>
      {item.clientTitle !== item.title ? (
        <span className="work-passport-card__project-name">Проект: {item.title}</span>
      ) : null}
      <p>{item.summary}</p>

      <dl className="work-passport-card__matrix">
        {detailBlocks.map((block) => (
          <div key={block.label}>
            <dt>{block.label}</dt>
            <dd>{block.value}</dd>
          </div>
        ))}
      </dl>

      <div className="work-passport-card__footer">
        <div aria-label="Технологии и метки">
          {item.tags.slice(0, 4).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <span className="work-passport-card__cta">
          Открыть кейс
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

export default async function WorkPage({ searchParams }: WorkPageProps) {
  const params = await searchParams;
  const requestedType = Array.isArray(params.type) ? params.type[0] : params.type;
  const activeFilter: CapabilityId | "all" = isCapabilityId(requestedType) ? requestedType : "all";
  const capabilityLabels = new Map(capabilities.map((capability) => [capability.id, capability.shortTitle]));
  const selectedFilter = WORK_FILTERS.find((filter) => filter.value === activeFilter);
  const selectedCapability = capabilities.find((capability) => capability.id === activeFilter);
  const filteredCases =
    activeFilter === "all"
      ? cases
      : cases.filter((item) => item.relatedCapabilities.includes(activeFilter));
  const hasActiveFilter = activeFilter !== "all";
  const resultTitle = hasActiveFilter
    ? `Кейсы по теме: ${selectedFilter?.label ?? selectedCapability?.shortTitle ?? activeFilter}`
    : "Все кейсы";

  return (
    <div className="work-page">
      <section className="work-hero">
        <div className="container">
          <div className="work-hero__grid">
            <div className="work-hero__copy">
              <p className="work-hero__kicker">Кейсы рабочих систем</p>
              <h1>Рабочие AI-системы, а не витрина экранов</h1>
              <p>
                Каждый кейс показывает систему в работе: бизнес-ситуация, собранный контур,
                данные, интеграции, AI-слои, контроль человеком и статус внедрения.
              </p>
              <div className="work-hero__actions">
                <Link href="/contacts" className="work-hero__primary">
                  Разобрать процесс
                </Link>
              </div>
            </div>

            <div className="work-hero__signals" aria-label="Сигналы витрины систем">
              <div>
                <span>22</span>
                <p>кейса рабочих систем</p>
              </div>
              <div>
                <span>7</span>
                <p>типов задач для AI-систем</p>
              </div>
              <div>
                <span>Контроль человеком</span>
                <p>человек остаётся в контуре контроля</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="work-results" className="work-passports-section">
        <div className="container">
          <div className="work-filter-panel">
            <div className="work-filter-panel__head">
              <div>
                <p>Фильтр по типу задачи</p>
                <h2>{resultTitle}</h2>
              </div>
              <span>Найдено: {filteredCases.length}</span>
            </div>

            <nav className="work-filter-panel__chips" aria-label="Фильтр кейсов рабочих систем">
              {WORK_FILTERS.map((filter) => {
                const isActive = activeFilter === filter.value;
                return (
                  <Link
                    key={filter.value}
                    href={getFilterHref(filter.value)}
                    className="work-filter-chip"
                    data-active={isActive}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {filter.label}
                  </Link>
                );
              })}
            </nav>

            {hasActiveFilter && selectedCapability ? (
              <div className="work-filter-panel__summary">
                <strong className="work-selected-filter-label">{selectedCapability.shortTitle}</strong>
                <p>{selectedCapability.summary}</p>
              </div>
            ) : null}
          </div>

          {filteredCases.length === 0 ? (
            <div className="work-empty-state">
              <Search className="h-8 w-8" aria-hidden="true" />
              <h2>По этому типу задачи пока нет кейсов</h2>
              <p>Выберите другой фильтр или откройте все кейсы.</p>
              <Link href="/work#work-results">Показать все кейсы</Link>
            </div>
          ) : (
            <>
              <div className="work-section-head work-section-head--results">
                <p>{hasActiveFilter ? "Кейсы по выбранной теме" : "Все кейсы"}</p>
                <h2>Подобранные кейсы</h2>
                <span>Найдено: {filteredCases.length}</span>
              </div>

              <div className="work-passport-grid">
                {filteredCases.map((item, index) => (
                  <PassportCard key={item.slug} item={item} index={index} capabilityLabels={capabilityLabels} />
                ))}
              </div>
            </>
          )}

          <div className="work-final-cta">
            <h2>Нужна похожая система под ваш процесс?</h2>
            <p>
              Опишите, где сейчас теряются данные, какие сервисы не связаны,
              какие решения принимаются вручную и где нужен контроль человека.
            </p>
            <div>
              <Link href="/contacts" className="work-final-cta__primary">
                Разобрать процесс
              </Link>
              <Link href="#work-results" className="work-final-cta__secondary">
                К началу кейсов
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
