import Image from "next/image";
import styles from "./about.module.scss";
import NavBar from "../Nav/Nav";
import TitleSection from "../TitleSection/TitleSection";

export default function About() {
  return (
    <div className={styles.aboutContainer}>
      {/* Navbar */}
      <TitleSection title="ABOUT" />
      <div className={styles.aboutContent}>
        <div className={styles.aboutleftPartContainer}>
          <p className={styles.aboutleftPartContent}>
            A MODERN CONCEPTION OF DESIGN
          </p>
        </div>
        <div className={styles.aboutImageContainer}>
          <Image
            src="/assets/about/about.jpg"
            alt="About Image"
            fill
            style={{ objectFit: "cover" }}
            className={styles.aboutImage}
          />
        </div>
        <div className={styles.aboutRightPartContainer}>
          <div className={styles.aboutRightPartSubContainer}>
            <div className={styles.aboutPartContainer}>
              <p className={styles.aboutRightText}>
                Since 2025, Ascent is one of the first company to innovate
              </p>
            </div>
            <div className={styles.aboutPartContainer}>
              <p className={styles.aboutRightText}>
                Since 2025, Ascent is one of the first company to innovate
              </p>
            </div>
            <div className={styles.aboutBtnContainer}>
              <button className={styles.aboutBtn}>Learn more</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
