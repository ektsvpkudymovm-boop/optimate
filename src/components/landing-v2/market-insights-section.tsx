"use client";

import { useState } from "react";
import { marketModes } from "./landing-v2-data";
import styles from "@/app/landing-v2/landing-v2.module.css";

export function MarketInsightsSection() {
  const [selected, setSelected] = useState("procurement");
  const mode = marketModes.find((item) => item.id === selected) ?? marketModes[0];
  return <section className={styles.marketSection} aria-labelledby="market-title"><div className={styles.v2Container}>
    <header className={styles.sectionHeader}><p className={styles.sectionKicker}>Данные о рынке</p><h2 id="market-title">Клиенты уже говорят вам, что им продавать. Мы помогаем это услышать.</h2><p>Анализируя массив коммуникаций, можно увидеть повторяющиеся потребности, недостающие товары, причины отказов и характеристики, которые вызывают недовольство.</p></header>
    <div className={styles.insightEvidence}><div className={styles.evidenceMessages}><p>Звонок <q>Нужна похожая позиция…</q></p><p>Письмо <q>Есть вариант для той же задачи…</q></p><p>Встреча <q>Пока закрываем сторонним решением…</q></p></div><div className={styles.signalArrow}>↓</div><div className={styles.signalResult}><span>Повторяющийся сигнал</span><h3>{mode.title}</h3><p>{mode.copy}</p><div role="tablist" aria-label="Направления анализа рынка">{marketModes.map((item) => <button type="button" role="tab" key={item.id} aria-selected={item.id === mode.id} onClick={() => setSelected(item.id)}>{item.label}</button>)}</div></div></div>
  </div></section>;
}
