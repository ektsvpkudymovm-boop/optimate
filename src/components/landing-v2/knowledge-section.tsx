"use client";

import { ArrowRight, Check, Database, Search } from "lucide-react";
import { useState } from "react";
import { knowledgeModes } from "./landing-v2-data";
import styles from "@/app/landing-v2/landing-v2.module.css";

export function KnowledgeSection() {
  const [activeMode, setActiveMode] = useState("sales");
  const mode = knowledgeModes.find((item) => item.id === activeMode) ?? knowledgeModes[1];
  return <section className={styles.knowledgeSection} aria-labelledby="knowledge-title"><div className={styles.v2Container}>
    <header className={styles.sectionHeader}><p className={styles.sectionKicker}>Флагман №1</p><h2 id="knowledge-title">ИИ-Википедия компании</h2><p>Единый интеллектуальный источник, который знает вашу компанию и помогает сотрудникам работать быстрее.</p></header>
    <div className={styles.knowledgeWorkbench}>
      <div className={styles.workbenchQuestion}><span><Search size={16} /> Вопрос</span><strong>Какой аналог предложить клиенту вместо X?</strong><p>ИИ отвечает на основе корпоративных знаний и подключённых систем.</p></div>
      <div className={styles.workbenchAnswer}><span><Check size={16} /> Ответ</span><h3>Есть несколько подходящих аналогов</h3><p>Система сравнивает назначение, характеристики и условия продажи — затем даёт менеджеру объяснимый вариант ответа.</p><div className={styles.answerAction}><small>Следующее действие</small><b>Подготовить предложение клиенту <ArrowRight size={15} /></b></div></div>
      <aside className={styles.workbenchSources}><span><Database size={15} /> Почему / источники</span>{["CRM и 1С", "CMS, сайты и приложения", "Документы и базы данных", "Каталоги и системы обучения"].map((source) => <p key={source}>↗ {source}</p>)}</aside>
      <div className={styles.knowledgeModes} role="tablist" aria-label="Сценарии ИИ-Википедии">{knowledgeModes.map((item) => <button key={item.id} type="button" role="tab" aria-selected={item.id === mode.id} onClick={() => setActiveMode(item.id)}>{item.label}</button>)}</div>
      <p className={styles.modeDescription}>{mode.copy}</p>
    </div><a className={styles.textAction} href="#final-cta">Обсудить ИИ-Википедию <ArrowRight size={16} /></a>
  </div></section>;
}
