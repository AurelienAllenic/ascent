import Image from "next/image";
import styles from "./footer.module.scss";

export default function Footer() {
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
          <a href="#" className={styles.mainTitle}>CGU</a>
        </div>
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © 2025 Ascent. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}