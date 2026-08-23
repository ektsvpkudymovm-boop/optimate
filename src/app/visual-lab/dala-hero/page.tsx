import type { Metadata } from "next";
import { VisualV4Hero } from "@/components/public/visual-v4-hero";

export const metadata: Metadata = {
  title: "Visual Lab V4 Hero | OptiMate",
  description: "Внутренний visual prototype hero для OptiMate.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DalaHeroVisualLabPage() {
  return (
    <>
      <VisualV4Hero id="visual-lab-v4-title" />
      <section className="v4-followup" aria-labelledby="visual-lab-v4-followup">
        <div className="v4-followup__inner">
          <p className="v4-hero__kicker">Operational center</p>
          <h2 id="visual-lab-v4-followup">
            Не витрина услуг, а поле автономной AI-инфраструктуры бизнеса
          </h2>
          <p>
            Первый экран продаёт способность проектировать систему: данные, интерфейсы,
            роли AI, интеграции, наблюдаемость и контроль человека.
          </p>
        </div>
      </section>
    </>
  );
}
