"use client";

import Image from "next/image";
import styles from "./footer.module.scss";
import { useLanguage } from "@/app/context/LanguageContext";
import { useEditableContent } from "@/app/context/EditableContentContext";

export interface FooterSectionType {
  cguButtonTextEn: string;
  cguButtonTextFr: string;
  cguButtonLink?: string;
  showCguButton: boolean;
  copyrightTextEn: string;
  copyrightTextFr: string;
}

export default function Footer() {
  const { footer } = useEditableContent();
  const { language } = useLanguage();

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
          {footer?.showCguButton && (
            <a
              href={footer?.cguButtonLink || "/cgu"}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mainTitle}
            >
              {language === "fr" ? footer?.cguButtonTextFr : footer?.cguButtonTextEn}
            </a>
          )}
        </div>
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            {language === "fr"
              ? footer?.copyrightTextFr.replace("2025", year.toString())
              : footer?.copyrightTextEn.replace("2025", year.toString())}
          </p>
        </div>
      </div>
    </div>
  );
}
