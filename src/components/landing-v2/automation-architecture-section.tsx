import { ArrowDown } from "lucide-react";
import { pipelineSteps } from "./landing-v2-data";
import styles from "@/app/landing-v2/landing-v2.module.css";

export function AutomationArchitectureSection() {
  return <section className={styles.architectureSection} aria-labelledby="architecture-title"><div className={styles.v2Container}><header className={styles.sectionHeader}><p className={styles.sectionKicker}>Не только два продукта</p><h2 id="architecture-title">Мы не продаём «ИИ ради ИИ». Мы автоматизируем процессы, которые стоят бизнесу времени и денег.</h2><p>Объединяем ИИ, программирование, интеграции и данные в индивидуальные системы.</p></header><div className={styles.pipeline} aria-label="Данные, ИИ, действие, аналитика — единый цикл">{pipelineSteps.map((step, index) => <div className={styles.pipelineStep} key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.copy}</p>{index < pipelineSteps.length - 1 ? <ArrowDown className={styles.pipelineArrow} aria-hidden="true" /> : <b className={styles.feedbackLoop}>↺</b>}</div>)}</div></div></section>;
}
