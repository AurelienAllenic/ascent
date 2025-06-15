import Image from "next/image";
import styles from "./hero.module.scss";

export default function Hero() {
  return (
    <div className={styles.heroContainer}>
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
            Time to improve your architecture
          </h2>
          <p className={styles.blockContentContent}>
            Thanks to our experts, we offer the best of architecture
          </p>
        </div>
      </div>
    </div>
  );
}
