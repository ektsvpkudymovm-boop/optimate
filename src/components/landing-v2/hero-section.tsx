import { ArrowRight } from "lucide-react";
import { OptiMateSystemDemo } from "./optimate-system-demo";
import styles from "@/app/landing-v2/landing-v2.module.css";

export function HeroSection() {
  return (
    <section id="hero" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.copy}>
        <p className={styles.eyebrow}>ИИ · программирование · интеграции · данные</p>
        <h1 id="hero-title">Ваш бизнес уже можно автоматизировать сильнее, чем вы думаете.</h1>
        <p className={styles.lead}>Убираем ручную работу, зависимость от «незаменимых» сотрудников и потерю данных — создавая интеллектуальные системы на базе ИИ, CRM, 1С, сайтов, баз данных и BI.</p>
        <div className={styles.actions}>
          <a className={styles.primaryAction} href="#system-demo">Показать, что можно автоматизировать <ArrowRight size={18} /></a>
          <a className={styles.secondaryAction} href="#system-demo">Узнать свои точки потерь</a>
        </div>
      </div>
      <div id="system-demo" className={styles.demoWrap}><OptiMateSystemDemo /></div>
    </section>
  );
}
