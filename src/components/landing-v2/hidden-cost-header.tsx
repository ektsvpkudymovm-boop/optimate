import { hiddenCostHeadline, hiddenCostIntro, hiddenCostKicker } from "./hidden-cost-data";
import styles from "@/app/landing-v2/landing-v2.module.css";

export function HiddenCostHeader() {
  return (
    <header className={styles.hiddenCostHeader}>
      <p className={styles.hiddenCostKicker}>{hiddenCostKicker}</p>
      <h2 id="hidden-cost-title" className={styles.hiddenCostTitle}>
        {hiddenCostHeadline}
      </h2>
      <p className={styles.hiddenCostIntro}>{hiddenCostIntro}</p>
    </header>
  );
}
