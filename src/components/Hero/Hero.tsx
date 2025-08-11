"use client"

import Image from "next/image";
import styles from "./hero.module.scss";
import NavBar from "../Nav/Nav";
import { useLanguage } from "@/app/context/LanguageContext";

export default function Hero() {
  const { language } = useLanguage();
  return (
    <div className={styles.heroContainer} id="home">
      <NavBar />
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
          <h1 className={styles.mainTitle}>ASCENT</h1>
        </div>
        <div className={styles.blockContent}>
          <h2 className={styles.blockContentTitle}>
            {language === "fr" ? "Il est temps d'améliorer votre architecture" : "Time to improve your architecture"}
          </h2>
          <p className={styles.blockContentContent}>
            {language === "fr" ? "Grâce à nos experts, nous offrons le meilleur de l'architecture" : "Thanks to our experts, we offer the best of architecture"}
          </p>
        </div>
      </div>
    </div>
  );
}
