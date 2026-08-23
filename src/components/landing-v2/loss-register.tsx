import { LossRow } from "./loss-row";
import { type LossScenario, type LossScenarioId, hiddenCostScenarios } from "./hidden-cost-data";
import styles from "@/app/landing-v2/landing-v2.module.css";

type LossRegisterProps = {
  selectedScenario: LossScenarioId;
  onSelectScenario: (next: LossScenarioId) => void;
};

export function LossRegister({ selectedScenario, onSelectScenario }: LossRegisterProps) {
  return (
    <section className={styles.lossRegister} aria-label="Реестр потерянных задач">
      {hiddenCostScenarios.map((scenario: LossScenario) => (
        <LossRow
          key={scenario.id}
          scenario={scenario}
          isSelected={scenario.id === selectedScenario}
          onSelect={onSelectScenario}
        />
      ))}
    </section>
  );
}
