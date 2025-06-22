import React from "react";
import TitleSection from "../TitleSection/TitleSection";
import NumberCard from "./NumberCard";
import styles from "./numbers.module.scss";

const Numbers: React.FC = () => {
  return (
    <section className={styles.numbersSection}>
      <TitleSection title="NUMBERS" color="white" />
      <div className={styles.cards}>
        <NumberCard
          number="100"
          unit="K€"
          text="Profits this year thanks to our customer's trust"
          size="large"
          customClass="large"
        />
        <NumberCard
          number="25"
          text="Employees dedicated to your projects"
          size="small"
          customClass="small"
        />
        <NumberCard
          number="97"
          unit="%"
          text="Of positive evaluations"
          size="medium"
          customClass="medium"
        />
        <NumberCard
          number="150+"
          text="Projects completed with our supervision"
          size="medium"
          customClass="medium"
        />
      </div>
    </section>
  );
};

export default Numbers;
