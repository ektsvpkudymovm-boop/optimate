import { workSteps } from "./landing-v2-data";
import styles from "@/app/landing-v2/landing-v2.module.css";

const processLabels = ["analysis", "losses", "design", "implementation"];

export function HowWeWorkSection() {
  return (
    <section className={styles.workSection} aria-labelledby="work-title">
      <div className={styles.v2Container}>
        <div className={styles.workLayout}>
          <header className={styles.workStatement}>
            <p className={styles.sectionKicker}>Как работаем</p>
            <h2 id="work-title">Не начинаем с технологии. Начинаем с вашей задачи.</h2>
            <p>Процесс остаётся прозрачным на каждом этапе — от первого разбора до работающей системы.</p>
          </header>
          <div className={styles.workProcess}>
            <div className={styles.workProgressLine} aria-hidden="true" />
            <ol className={styles.workTimeline}>
              {workSteps.map((step, index) => (
                <li key={step.number}>
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
