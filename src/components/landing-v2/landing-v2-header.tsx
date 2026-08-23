import { ArrowUpRight, Menu } from "lucide-react";
import styles from "@/app/landing-v2/landing-v2.module.css";

export function LandingV2Header() {
  return (
    <header className={styles.header}>
      <a href="#hero" className={styles.brand} aria-label="OptiMate — начало страницы">
        <span className={styles.brandMark}>O</span><span>OptiMate</span>
      </a>
      <div className={styles.headerMeta}><span>AI PRODUCT &amp; AUTOMATION LAB</span><span>01 / 01</span></div>
      <a href="#hero" className={styles.headerAction}>Обсудить систему <ArrowUpRight size={16} /></a>
      <button type="button" className={styles.menuButton} aria-label="Открыть меню"><Menu size={20} /></button>
    </header>
  );
}
