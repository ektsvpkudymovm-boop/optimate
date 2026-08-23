import { Check } from "lucide-react";
import { landingCases } from "./landing-v2-data";
import styles from "@/app/landing-v2/landing-v2.module.css";

export function CasesSection() {
  return <section className={styles.casesSection} aria-labelledby="cases-title"><div className={styles.v2Container}><header className={styles.sectionHeader}><p className={styles.sectionKicker}>Кейсы</p><h2 id="cases-title">Как это работает у реальных компаний</h2><p>Корпоративная ИИ-Википедия для ювелирного бизнеса, для продажи премиального парфюма и система распознавания звонков и встреч для крупного производителя одежды.</p></header><div className={styles.casePassports}>{landingCases.map((item, index) => <article key={item.title} className={`${styles.casePassport} ${index % 2 ? styles.casePassportReversed : ""}`}><div className={styles.caseVisual} style={{ backgroundImage: `url(${item.image})` }}><div className={styles.caseVisualOverlay} /><p>{item.tag}</p><strong>{item.visual}</strong><span aria-hidden="true">{index === 2 ? "Разговор\n↓\nСаммари\n↓\nЗадача" : "Запрос\n↓\nЗнания\n↓\nРекомендация"}</span></div><div className={styles.caseContent}><p className={styles.caseTag}>{item.tag}</p><h3>{item.title}</h3><p>{item.description}</p><ul>{item.capabilities.map((capability) => <li key={capability}><Check size={14} />{capability}</li>)}</ul></div></article>)}</div></div></section>;
}
