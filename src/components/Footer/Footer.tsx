"use client";

import Image from "next/image";
import styles from "./footer.module.scss";
import { useLanguage } from "@/app/context/LanguageContext";

export default function Footer() {
  const { language } = useLanguage();

  // Fonction qui retourne l'année actuelle
  function getCurrentYear() {
    return new Date().getFullYear();
  }

  const year = getCurrentYear();

  return (
    <div className={styles.footerContainer} id="footer">
      <Image
        src="/assets/background.png"
        alt="Background"
        fill
        style={{ objectFit: "cover" }}
        className={styles.background}
      />
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <div className={styles.mainTitleContainer}>
          <a href="/cgu" target="_blank" rel="noopener noreferrer" className={styles.mainTitle}>CGU</a>
        </div>
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            {language === "fr"
              ? `© ${year} Ascent. Tous droits réservés.`
              : `© ${year} Ascent. All rights reserved.`}
          </p>
        </div>
      </div>
    </div>
  );
}
