import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ParticleConstellation } from "./particle-constellation";

type VisualV4HeroProps = {
  id?: string;
};

export function VisualV4Hero({ id = "home-hero-title" }: VisualV4HeroProps) {
  return (
    <section className="v4-hero" aria-labelledby={id}>
      <div className="v4-hero__inner">
        <div className="v4-hero__copy">
          <p className="v4-hero__kicker">AI Product & Automation Lab</p>
          <h1 id={id} className="v4-hero__title">
            <span>AI-системы</span>
            <span>для бизнеса,</span>
            <span>который вырос</span>
            <span>из ручного</span>
            <span>управления</span>
          </h1>
          <p className="v4-hero__lead">
            Проектируем автономные операционные контуры: интерфейсы, данные,
            AI-агентов, RAG, CRM, n8n/API-пайплайны, аналитику и контроль человека.
          </p>
          <div className="v4-hero__actions" aria-label="Основные действия">
            <Link href="/contacts" className="v4-hero__primary">
              Разобрать процесс
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/work" className="v4-hero__ghost">
              Смотреть системы
            </Link>
          </div>
          <p className="v4-hero__status">
            <span className="v4-hero__status-night">Autonomous mode: система продолжает держать процесс.</span>
            <span className="v4-hero__status-day">Human-in-control: команда управляет операционным контуром.</span>
          </p>
        </div>

        <div className="v4-hero__visual" aria-hidden="true">
          <ParticleConstellation />
        </div>
      </div>
    </section>
  );
}
