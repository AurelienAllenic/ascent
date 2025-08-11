"use client"

import styles from "./titleSection.module.scss";
import { useLanguage } from "@/app/context/LanguageContext";

export default function TitleSection({
  titleEn,
  titleFr,
  color,
}: {
  titleEn: string;
  titleFr: string;
  color?: string;
}) {
  const titleClasses = `${styles.titleSection} ${
    color === "white" ? styles.titleSectionWhite : ""
  }`;

  const { language } = useLanguage();

  return (
    <div className={styles.titleSectionContainer}>
      <p className={titleClasses}>{language == 'fr' ? titleFr : titleEn}</p>
    </div>
  );
}
