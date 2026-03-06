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

          <section className={styles.section} aria-labelledby="tracking-title">
            <h2 id="tracking-title">
              {isFr ? "Suivi d’audience (tracking) sur ce site" : "Audience tracking on this site"}
            </h2>
            <p>
              {isFr
                ? "Ce site utilise un système de suivi d’audience interne et personnalisé, afin de mesurer la fréquentation des différentes pages et interactions (clics sur certains liens ou boutons). Aucune donnée personnelle n’est collectée : les données sont strictement anonymisées et ne permettent pas de vous identifier. Aucun cookie tiers ni outil publicitaire n’est utilisé dans le cadre de ce suivi."
                : "This site uses an internal, custom audience tracking system to measure page visits and interactions (clicks on certain links or buttons). No personal data is collected: all data is strictly anonymized and cannot be used to identify you. No third-party cookies or advertising tools are used for this tracking."}
            </p>
            <p>
              {isFr
                ? "Ces informations nous aident à améliorer l’ergonomie et le contenu du site. Vous pouvez utiliser le site en sachant qu’aucune donnée nominative ni trace permettant une identification personnelle n’est enregistrée."
                : "This information helps us improve the site’s usability and content. You can use the site knowing that no nominative data or trace allowing personal identification is recorded."}
            </p>
          </section>

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
