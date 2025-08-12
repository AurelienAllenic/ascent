"use client";

import React, {useState} from "react";
import styles from "./cgu.module.scss";
import { useLanguage } from "@/app/context/LanguageContext";
import ChangeLanguageModal from "../ChangeLanguageModal/ChangeLanguageModal";

const COMPANY_NAME = "Ascent";
const OWNER = "Propriétaire d'Ascent";
const ADDRESS = "Adresse, Ville, Pays";
const SIRET = "SIRET / Identifiant (si applicable)";
const HOST = "Hébergeur (ex: Vercel, OVH)";
const CONTACT_EMAIL = "contact@ascent.example";

export default function CguPage(){
  const { language, setLanguage } = useLanguage();
  const [isLangModalOpen, setLangModalOpen] = useState(false);

  const toggleLang = () => {
    setLanguage(language === "en" ? "fr" : "en");
    setLangModalOpen(true);
  };

  const isFr = language === "fr";

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

        <section className={styles.section}>
          <h2>{isFr ? "1. Objet" : "1. Purpose"}</h2>
          <p>
            {isFr
              ? `${COMPANY_NAME} met à disposition un site vitrine présentant des services d'architecture. Ces conditions définissent les modalités d'accès et d'utilisation du site.`
              : `${COMPANY_NAME} provides a showcase website presenting architecture services. These terms define the rules for accessing and using the site.`}
          </p>
        </section>

        <section className={styles.section}>
          <h2>{isFr ? "2. Éditeur et Hébergement" : "2. Publisher & Hosting"}</h2>
          <ul>
            <li>
              <strong>{isFr ? "Éditeur" : "Publisher"}:</strong> {OWNER}
            </li>
            <li>
              <strong>{isFr ? "Adresse" : "Address"}:</strong> {ADDRESS}
            </li>
            <li>
              <strong>{isFr ? "Identifiant" : "Company ID"}:</strong> {SIRET}
            </li>
            <li>
              <strong>{isFr ? "Hébergeur" : "Host"}:</strong> {HOST}
            </li>
            <li>
              <strong>{isFr ? "Contact" : "Contact"}:</strong>{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>{isFr ? "3. Accès au site" : "3. Access to the site"}</h2>
          <p>
            {isFr
              ? "L'accès au site est gratuit. L'utilisateur doit disposer d'un équipement compatible (navigateur moderne, connexion internet). L'accès peut être interrompu pour maintenance."
              : "Access to the site is free. The user must have compatible equipment (modern browser, internet connection). Access may be interrupted for maintenance."}
          </p>
        </section>

        <section className={styles.section}>
          <h2>{isFr ? "4. Propriété intellectuelle" : "4. Intellectual Property"}</h2>
          <p>
            {isFr
              ? "Tous les contenus présents sur le site (textes, images, logos, vidéos, code, animations) sont la propriété de l'éditeur ou de ses ayants droit et sont protégés par le droit d'auteur. Toute reproduction, représentation ou utilisation non autorisée est interdite."
              : "All content on the site (texts, images, logos, videos, code, animations) is the property of the publisher or its rights holders and is protected by copyright. Any unauthorized reproduction, representation or use is prohibited."}
          </p>
        </section>

        <section className={styles.section}>
          <h2>{isFr ? "5. Données personnelles & suivi d'audience" : "5. Personal Data & Analytics"}</h2>
          <p>
            {isFr
              ? "Le site collecte uniquement les données nécessaires au fonctionnement et aux interactions (formulaire de contact). Ces données sont destinées à l'administrateur du site et ne seront pas revendues."
              : "The site collects only the data necessary for operation and interactions (contact form). These data are intended for the site administrator and will not be sold."}
          </p>

          <p>
            {isFr
              ? "À l'avenir, un outil de suivi d'audience (ex : Google Analytics ou solution maison) pourra être mis en place pour suivre le nombre de visiteurs et des statistiques agrégées. Ces dispositifs seront implémentés en respectant la réglementation applicable (RGPD) : information préalable, finalités, durée de conservation et possibilité de retrait du consentement lorsque nécessaire."
              : "In the future, an analytics tool (e.g. Google Analytics or home-made solution) may be implemented to track visitor numbers and aggregated statistics. These tools will be implemented in compliance with applicable regulations (GDPR): prior information, purposes, retention periods and the ability to withdraw consent where required."}
          </p>

          <p>
            {isFr
              ? "Les utilisateurs disposent des droits d'accès, de rectification, d'effacement et d'opposition. Pour exercer ces droits, contactez :"
              : "Users have the rights of access, rectification, erasure and objection. To exercise these rights, contact:"}{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
        </section>

        <section className={styles.section}>
          <h2>{isFr ? "6. Formulaire de contact" : "6. Contact form"}</h2>
          <p>
            {isFr
              ? "Les informations envoyées via le formulaire (nom, email, message) servent uniquement à traiter la demande. Elles sont conservées pour la durée nécessaire au traitement de la demande, sauf obligation légale contraire."
              : "Information sent via the contact form (name, email, message) is used only to process the request. It is retained only as long as necessary to handle the request, unless otherwise required by law."}
          </p>
        </section>

        <section className={styles.section}>
          <h2>{isFr ? "7. Cookies" : "7. Cookies"}</h2>
          <p>
            {isFr
              ? "Le site peut utiliser : cookies techniques indispensables au fonctionnement ; cookies statistiques pour mesurer l'audience ; cookies marketing (le cas échéant). Les cookies statistiques/marketing sont soumis au consentement lorsque la loi l'exige. Un bandeau cookie et une gestion des préférences doivent être disponibles."
              : "The site may use: technical cookies essential for operation; analytics cookies to measure audience; marketing cookies (if any). Analytics/marketing cookies are subject to consent where required by law. A cookie banner and preference management must be available."}
          </p>
        </section>

        <section className={styles.section}>
          <h2>{isFr ? "8. Sécurité et responsabilité" : "8. Security & Liability"}</h2>
          <p>
            {isFr
              ? "L'éditeur met en œuvre des mesures raisonnables pour sécuriser le site. Toutefois, l'éditeur ne peut garantir l'absence d'incidents (coupures, bugs, attaques). L'utilisateur utilise le site sous sa responsabilité."
              : "The publisher implements reasonable measures to secure the site. However, the publisher cannot guarantee the absence of incidents (outages, bugs, attacks). The user uses the site at their own risk."}
          </p>
        </section>

        <section className={styles.section}>
          <h2>{isFr ? "9. Accès administrateur" : "9. Admin access"}</h2>
          <p>
            {isFr
              ? "L'accès à l'espace de gestion et aux données collectées est strictement réservé au propriétaire du site. Les identifiants doivent rester confidentiels."
              : "Access to the administration area and collected data is strictly reserved to the site owner. Credentials must remain confidential."}
          </p>
        </section>

        <section className={styles.section}>
          <h2>{isFr ? "10. Droit applicable & juridiction" : "10. Governing law & jurisdiction"}</h2>
          <p>
            {isFr
              ? "Les présentes conditions sont régies par le droit français. En cas de litige, les tribunaux compétents seront ceux du ressort du siège social, sauf disposition contraire impérative."
              : "These terms are governed by French law. In case of dispute, the competent courts will be those of the company's registered office, unless otherwise required by mandatory rules."}
          </p>
        </section>

        <section className={styles.section}>
          <h2>{isFr ? "11. Modifications" : "11. Changes"}</h2>
          <p>
            {isFr
              ? "Les présentes CGU peuvent être modifiées. La version en ligne est celle opposable aux utilisateurs. La date de dernière mise à jour est indiquée sur la page."
              : "These terms may be amended. The online version is the one enforceable against users. The last updated date should be indicated on the page."}
          </p>
        </section>

        <footer className={styles.footer}>
          <p>
            {isFr
              ? "Pour toute question relative aux CGU ou aux données personnelles, contactez :"
              : "For any questions regarding these terms or personal data, contact:"}{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
          <p className={styles.update}>
            {isFr ? "Dernière mise à jour :" : "Last updated:"} {new Date().toLocaleDateString(isFr ? "fr-FR" : "en-US")}
          </p>
        </footer>
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
