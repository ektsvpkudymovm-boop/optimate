"use client";

import { useMemo, useState } from "react";
import { HiddenCostHeader } from "./hidden-cost-header";
import { LossRegister } from "./loss-register";
import { LossProcess } from "./loss-process";
import {
  hiddenCostPrinciple,
  hiddenCostScenarios,
  type LossScenarioId,
} from "./hidden-cost-data";
import styles from "@/app/landing-v2/landing-v2.module.css";

const firstScenario = hiddenCostScenarios[0]?.id ?? "information";

export function HiddenCostSection() {
  const [selectedScenario, setSelectedScenario] = useState<LossScenarioId>(firstScenario);

  const activeScenario = useMemo(
    () => hiddenCostScenarios.find((scenario) => scenario.id === selectedScenario) ?? hiddenCostScenarios[0],
    [selectedScenario],
  );

  return (
    <section className={styles.hiddenCostSection} aria-labelledby="hidden-cost-title">
      <div className={styles.hiddenCostGrid}>
        <HiddenCostHeader />
        <div className={styles.hiddenCostAuditSurface}>
          <LossRegister selectedScenario={selectedScenario} onSelectScenario={(next) => setSelectedScenario(next)} />
          <aside className={styles.hiddenCostProcessPanel} aria-live="polite">
            <p className={styles.hiddenCostProcessTitle}>Как выглядит потеря</p>
            <div key={activeScenario.id} className={`${styles.hiddenCostProcessContent} ${styles.lossProcessContentEnter}`}>
              <LossProcess steps={activeScenario.sequence} />
            </div>
          </aside>
        </div>
        <p className={styles.hiddenCostPrinciple} aria-label="Главный принцип">
          {hiddenCostPrinciple}
        </p>
      </div>
    </section>
  );
}
