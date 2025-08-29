"use client";

import React, { useState } from "react";
import styles from "./cgu.module.scss";
import { useLanguage } from "@/app/context/LanguageContext";
import ChangeLanguageModal from "../ChangeLanguageModal/ChangeLanguageModal";
import { useEditableContent } from "@/app/context/EditableContentContext";

export interface CguSectionType {
  sectionNumber: number;
  titleEn: string;
  titleFr: string;
  contentEn: string;
  contentFr: string;
  contactTextEn?: string;
  contactTextFr?: string;
  contactMail?: string;
  updatedAt?: string | Date;
}

export default function CguPage() {
  const { language, setLanguage } = useLanguage();
  const [isLangModalOpen, setLangModalOpen] = useState(false);
  const { cgu } = useEditableContent(); // CGU depuis le back
  const isFr = language === "fr";

  const toggleLang = () => {
    setLanguage(isFr ? "en" : "fr");
    setLangModalOpen(true);
  };

  // Footer provenant des données back (si défini)
  const footerSection = cgu?.find(sec => sec.contactMail) ?? null;

  return (
    <>
      <main className={styles.cguPage} aria-labelledby="cgu-title">
        <button
          className={styles.langButton}
          onClick={toggleLang}
          aria-label={isFr ? "Changer la langue en anglais" : "Switch language to French"}
          type="button"
        >
          {isFr ? "EN / FR" : "FR / EN"}
        </button>

        <div className={styles.container}>
          <h1 id="cgu-title" className={styles.title}>
            {isFr ? "Conditions Générales d'Utilisation (CGU)" : "Terms of Use (TOU)"}
          </h1>

          {cgu?.map(section => (
            <section key={section.sectionNumber} className={styles.section}>
              <h2>
                {section.sectionNumber}. {isFr ? section.titleFr : section.titleEn}
              </h2>
              <p>{isFr ? section.contentFr : section.contentEn}</p>
            </section>
          ))}

          {footerSection && (
            <footer className={styles.footer}>
              <p>
                {isFr ? footerSection.contactTextFr : footerSection.contactTextEn}{" "}
                <a href={`mailto:${footerSection.contactMail}`}>{footerSection.contactMail}</a>
              </p>
            </footer>
          )}
        </div>
      </main>

      <ChangeLanguageModal
        isOpen={isLangModalOpen}
        onClose={() => setLangModalOpen(false)}
        currentLanguage={language}
      />
    </>
  );
}
