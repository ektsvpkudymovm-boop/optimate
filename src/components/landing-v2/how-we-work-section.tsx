import { workSteps } from "./landing-v2-data";
import styles from "@/app/landing-v2/landing-v2.module.css";

export function HowWeWorkSection() { return <section className={styles.workSection} aria-labelledby="work-title"><div className={styles.v2Container}><header className={styles.sectionHeader}><p className={styles.sectionKicker}>Как работаем</p><h2 id="work-title">Не начинаем с технологии. Начинаем с вашей задачи.</h2></header><ol className={styles.workTimeline}>{workSteps.map((step) => <li key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.copy}</p></li>)}</ol></div></section>; }
