"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./resetpassword.module.scss";
import { useLanguage } from "@/app/context/LanguageContext";
import ChangeLanguageModal from "../ChangeLanguageModal/ChangeLanguageModal";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const { language, setLanguage } = useLanguage();
  const [isLangModalOpen, setLangModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const texts = {
    emailLabel: language === "fr" ? "Adresse email" : "Email address",
    emailPlaceholder:
      language === "fr"
        ? "Votre email"
        : "Please enter your email",
    passwordLabel: language === "fr" ? "Mot de passe" : "Password",
    passwordPlaceholder:
      language === "fr"
        ? "Votre mot de passe"
        : "Please enter your password",
    loginText: language === "fr" ? "Mot de passe oublié" : "Forgot password",
    validate: language === "fr" ? "Valider" : "Validate",
    passwordIssue: language === "fr" ? "Page de connexion" : "Connexion page",
    toggleLangButton: language === "fr" ? "EN / FR" : "FR / EN",
    showPassword: language === "fr" ? "Afficher le mot de passe" : "Show password",
    hidePassword: language === "fr" ? "Masquer le mot de passe" : "Hide password",
  };

  const toggleLang = () => {
    console.log("BOUTON CLIQUÉ !!! Langue actuelle:", language);
    setLanguage(language === "en" ? "fr" : "en");
    setLangModalOpen(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
        <p className={styles.loginLink}>
          {texts.loginText}
        </p>
        <form className={styles.form}>
          <div className={styles.formPart}>
            <label className={styles.label} htmlFor="email">
              {texts.emailLabel}
            </label>
            <div className={styles.passwordContainer}>
                <input
                id="email"
                type="email"
                placeholder={texts.emailPlaceholder}
                className={styles.input}
                />
            </div>
          </div>
          <button type="submit" className={styles.validate}>
            {texts.validate}
          </button>
        </form>

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
