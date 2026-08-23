"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { faqItems } from "./landing-v2-data";
import styles from "@/app/landing-v2/landing-v2.module.css";

export function LandingV2FaqSection() { const [open, setOpen] = useState<number | null>(null); return <section className={styles.faqSection} aria-labelledby="faq-title"><div className={styles.v2Container}><header className={styles.sectionHeader}><p className={styles.sectionKicker}>Частые вопросы</p><h2 id="faq-title">Что важно знать до разговора с нами</h2></header><div className={styles.faqRows}>{faqItems.map(([question, answer], index) => { const isOpen = open === index; return <div className={styles.faqRow} key={question}><button type="button" aria-expanded={isOpen} aria-controls={`landing-v2-faq-${index}`} onClick={() => setOpen(isOpen ? null : index)}><span>{question}</span>{isOpen ? <Minus aria-hidden="true" /> : <Plus aria-hidden="true" />}</button><div id={`landing-v2-faq-${index}`} hidden={!isOpen}><p>{answer}</p></div></div>; })}</div></div></section>; }
