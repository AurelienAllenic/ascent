"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./forgotpassword.module.scss";
import { useLanguage } from "@/app/context/LanguageContext";
import ChangeLanguageModal from "../ChangeLanguageModal/ChangeLanguageModal";

export default function ForgotPassword() {
  const { language, setLanguage } = useLanguage();
  const [isLangModalOpen, setLangModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const texts = {
    emailLabel: language === "fr" ? "Adresse email" : "Email address",
    emailPlaceholder:
      language === "fr" ? "Votre email" : "Please enter your email",
    loginText: language === "fr" ? "Mot de passe oublié" : "Forgot password",
    validate: language === "fr" ? "Valider" : "Validate",
    passwordIssue: language === "fr" ? "Page de connexion" : "Connexion page",
    toggleLangButton: language === "fr" ? "EN / FR" : "FR / EN",
  };

  const toggleLang = () => {
    setLanguage(language === "en" ? "fr" : "en");
    setLangModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage("Envoi en cours...");

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const text = await res.text();
      if (res.ok) {
        setStatusMessage(
          language === "fr"
            ? "Un email de réinitialisation a été envoyé si l'adresse existe."
            : "A reset email has been sent if the address exists."
        );
      } else {
        setStatusMessage(text);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage(
        language === "fr"
          ? "Erreur lors de l'envoi de l'email"
          : "Error sending the email"
      );
    }
  };

  return (
    <div className={styles.container}>
      <button
        onClick={toggleLang}
        className={styles.langButtonLogin}
        aria-label={
          language === "fr"
            ? "Changer la langue en anglais"
            : "Switch language to French"
        }
        type="button"
      >
        {texts.toggleLangButton}
      </button>

      <Image
        src="/assets/background.png"
        alt="Background"
        fill
        className={styles.background}
        priority
        style={{ zIndex: 1 }}
      />

      <div className={styles.content}>
        <p className={styles.loginLink}>{texts.loginText}</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formPart}>
            <label className={styles.label} htmlFor="email">
              {texts.emailLabel}
            </label>
            <input
              id="email"
              type="email"
              placeholder={texts.emailPlaceholder}
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.validate}>
            {texts.validate}
          </button>
        </form>

        {statusMessage && <p className={styles.statusMessage}>{statusMessage}</p>}

        <a href="/login" className={styles.passwordIssue}>
          {texts.passwordIssue}
        </a>
      </div>

      <ChangeLanguageModal
        isOpen={isLangModalOpen}
        onClose={() => setLangModalOpen(false)}
        currentLanguage={language}
      />
    </div>
  );
}
