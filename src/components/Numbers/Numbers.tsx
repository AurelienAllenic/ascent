import React from "react";
import TitleSection from "../TitleSection/TitleSection";
import NumberCard from "./NumberCard";
import styles from "./numbers.module.scss";

const Numbers: React.FC = () => {
  return (
    <section className={styles.numbersSection} id="numbers">
      <TitleSection titleEn="NUMBERS" titleFr="CHIFFRES" color="white" />
      <div className={styles.cards}>
        <NumberCard
          number="100"
          unit="K€"
          textFr="De bénéfices cette année grâce à la confiance de nos clients"
          textEn="Profits this year thanks to our customer's trust"
          size="large"
          customClass="large"
          animationDelay={0}
        />
        <NumberCard
          number="25"
          textFr="Employés dédiés à vos projets"
          textEn="Employees dedicated to your projects"
          size="small"
          customClass="small"
          animationDelay={0.2}
        />
        <NumberCard
          number="97"
          unit="%"
          textFr="D'évaluations positives"
          textEn="Of positive evaluations"
          size="medium"
          customClass="medium"
          animationDelay={0.4}
        />
        <NumberCard
          number="150+"
          textFr="Projets terminés sous notre supervision"
          textEn="Projects completed with our supervision"
          size="medium"
          customClass="medium"
          animationDelay={0.6}
        />
      </div>
    </section>
  );
};

export default Numbers;
