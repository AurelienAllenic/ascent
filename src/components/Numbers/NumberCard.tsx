import React from "react";
import styles from "./numberCard.module.scss";

interface NumberCardProps {
  number: number | string;
  unit?: string;
  text: string;
  size: "small" | "medium" | "large";
  customClass?: string;
}

const NumberCard: React.FC<NumberCardProps> = ({
  number,
  unit,
  text,
  size,
  customClass,
}) => {
  return (
    <div className={`${styles.numberCard} ${customClass || ""}`}>
      <span className={`${styles.number} ${styles[size]}`}>
        {number}
        {unit && <span className={styles.unit}>{unit}</span>}
      </span>
      <p className={`${styles.text} ${styles[size]}`}>{text}</p>
    </div>
  );
};

export default NumberCard;
