import { LossProcess } from "./loss-process";
import { type LossScenario } from "./hidden-cost-data";
import styles from "@/app/landing-v2/landing-v2.module.css";

type LossRowProps = {
  scenario: LossScenario;
  isSelected: boolean;
  onSelect: (id: LossScenario["id"]) => void;
};

export function LossRow({ scenario, isSelected, onSelect }: LossRowProps) {
  return (
    <article data-loss-row className={styles.lossRowWrap}>
      <button
        type="button"
        className={styles.lossRow}
        data-selected={isSelected ? "true" : "false"}
        onClick={() => onSelect(scenario.id)}
        aria-expanded={isSelected}
        aria-controls={`hidden-cost-process-${scenario.id}`}
      >
        <span className={styles.lossRowSignal} aria-hidden="true" />
        <span className={styles.lossRowNumber}>{scenario.number}</span>
        <div className={styles.lossRowText}>
          <p className={styles.lossRowTitle}>{scenario.title}</p>
          <p className={styles.lossRowDescription}>{scenario.description}</p>
        </div>
      </button>
      <div
        id={`hidden-cost-process-${scenario.id}`}
        data-visible={isSelected ? "true" : "false"}
        className={styles.lossRowProcessPanel}
      >
        <p className={styles.hiddenCostProcessTitle} id={`hidden-cost-process-title-${scenario.id}`}>
          Как выглядит потеря
        </p>
        <LossProcess steps={scenario.sequence} />
      </div>
    </article>
  );
}
