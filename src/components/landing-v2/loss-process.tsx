import styles from "@/app/landing-v2/landing-v2.module.css";

type LossProcessProps = {
  steps: string[];
};

export function LossProcess({ steps }: LossProcessProps) {
  return (
    <ol className={styles.lossProcessSequence} aria-label="Сценарий потерь">
      {steps.map((step, index) => {
        const marker = String(index + 1).padStart(2, "0");
        return (
          <li key={`${marker}-${index}`} className={styles.lossProcessStep}>
            <span className={styles.lossProcessMarker} aria-hidden="true">
              {marker}
            </span>
            <p className={styles.lossProcessAction}>{step}</p>
          </li>
        );
      })}
    </ol>
  );
}
