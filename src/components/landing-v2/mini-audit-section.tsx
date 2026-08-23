"use client";

import { useState } from "react";
import { auditQuestions } from "./landing-v2-data";
import { getAuditResult } from "./mini-audit-logic";
import styles from "@/app/landing-v2/landing-v2.module.css";

export function MiniAuditSection() {
  const [selected, setSelected] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const result = getAuditResult(selected);
  function toggle(index: number) { setSelected((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]); }
  return <section className={styles.auditSection} aria-labelledby="audit-title"><div className={styles.v2Container}><header className={styles.sectionHeader}><p className={styles.sectionKicker}>Мини-аудит</p><h2 id="audit-title">Ответьте себе на 7 вопросов</h2><p>Отметьте, что происходит в вашей компании, и получите целевое предложение с персональными рекомендациями.</p></header><div className={styles.auditCounter}>{selected.length} / 7</div><div className={styles.auditQuestions}>{auditQuestions.map((question, index) => <label className={styles.auditQuestion} data-selected={selected.includes(index)} key={question}><input type="checkbox" checked={selected.includes(index)} onChange={() => toggle(index)} /><span>{String(index + 1).padStart(2, "0")}</span><b>{question}</b></label>)}</div><button type="button" className={styles.auditButton} onClick={() => setShowResult(true)}>Получить вывод</button>{showResult ? <div className={styles.auditResult} aria-live="polite"><p className={styles.monoLabel}>Диагностический вывод</p><h3>{result.heading}</h3><p>{result.lead}</p>{result.recommendations.length > 0 ? <ul>{result.recommendations.map((recommendation) => <li key={recommendation}>{recommendation}</li>)}</ul> : null}<a href="#final-cta" className={styles.auditResultAction}>Оставить заявку →</a></div> : null}</div></section>;
}
