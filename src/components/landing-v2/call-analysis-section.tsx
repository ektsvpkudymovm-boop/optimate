"use client";

import { Check, ChevronRight } from "lucide-react";
import { useState } from "react";
import { callCapabilities } from "./landing-v2-data";
import styles from "@/app/landing-v2/landing-v2.module.css";

export function CallAnalysisSection() {
  const [capability, setCapability] = useState(0);
  return <section className={styles.callSection} aria-labelledby="calls-title"><div className={styles.v2Container}>
    <header className={styles.sectionHeader}><p className={styles.sectionKicker}>Флагман №2</p><h2 id="calls-title">ИИ анализирует разговоры менеджеров — чтобы руководителю не пришлось.</h2><p>Телефонные разговоры, онлайн-встречи и переговоры превращаются в структурированную аналитику и рекомендации.</p></header>
    <div className={styles.conversationSurface}><div className={styles.transcript}><p className={styles.monoLabel}>Разговор · 12:41</p><h3>Каждый разговор превращается в данные</h3><div><time>02:14</time><p>Нужна похожая позиция, но в другом исполнении.</p></div><div><time>04:07</time><p>Важно, чтобы решение можно было получить быстро.</p></div><div><time>08:31</time><p>Тогда пришлите варианты и условия.</p></div></div><div className={styles.conversationUnderstanding}><p className={styles.monoLabel}>Понимание</p>{[["Потребность", "Аналог под задачу клиента"], ["Возражение", "Срок и доступность"], ["Договорённость", "Подготовить варианты"], ["Следующий шаг", "Отправить предложение" ]].map(([label, value]) => <div key={label}><span>{label}</span><b>{value}</b></div>)}</div><aside className={styles.conversationActions}><p className={styles.monoLabel}>Действие</p>{["Саммари готово", "CRM обновлена", "Задача создана", "Рекомендация менеджеру"].map((item) => <p key={item}><Check size={14} />{item}</p>)}</aside></div>
    <div className={styles.capabilityRail} role="tablist" aria-label="Возможности анализа разговоров">{callCapabilities.map((item, index) => <button key={item.title} type="button" role="tab" aria-selected={index === capability} onClick={() => setCapability(index)}><span>0{index + 1}</span>{item.title}<ChevronRight size={14} /></button>)}</div><p className={styles.capabilityDescription}>{callCapabilities[capability].copy}</p>
  </div></section>;
}
