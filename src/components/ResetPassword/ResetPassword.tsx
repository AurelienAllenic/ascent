"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./resetpassword.module.scss";
import { useLanguage } from "@/app/context/LanguageContext";
import ChangeLanguageModal from "../ChangeLanguageModal/ChangeLanguageModal";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const { language, setLanguage } = useLanguage();
  const [isLangModalOpen, setLangModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = searchParams.get("token");
    setToken(tokenFromUrl);
  }, []);

  const texts = {
    passwordLabel: language === "fr" ? "Nouveau mot de passe" : "New password",
    confirmPasswordLabel: language === "fr" ? "Confirmer le mot de passe" : "Confirm password",
    validate: language === "fr" ? "Valider" : "Validate",
    passwordIssue: language === "fr" ? "Page de connexion" : "Login page",
    toggleLangButton: language === "fr" ? "EN / FR" : "FR / EN",
    pageTitle: language === "fr" ? "Réinitialisation du mot de passe" : "Reset password",
    showPassword: language === "fr" ? "Afficher le mot de passe" : "Show password",
    hidePassword: language === "fr" ? "Masquer le mot de passe" : "Hide password",
  };

  const toggleLang = () => {
    setLanguage(language === "en" ? "fr" : "en");
    setLangModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setStatusMessage(language === "fr" ? "Veuillez remplir tous les champs" : "Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      setStatusMessage(language === "fr" ? "Les mots de passe ne correspondent pas" : "Passwords do not match");
      return;
    }
    if (!token) {
      setStatusMessage(language === "fr" ? "Token manquant" : "Missing token");
      return;
    }

    setStatusMessage(language === "fr" ? "Envoi en cours..." : "Submitting...");

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMessage(language === "fr" ? "Mot de passe changé avec succès !" : "Password changed successfully!");
        setTimeout(() => window.location.href = "/login", 2000);
      } else {
        setStatusMessage(data.error || "Erreur");
      }
    } catch (err) {
      console.error(err);
      setStatusMessage(language === "fr" ? "Erreur serveur" : "Server error");
    }
  };

  return (
    <div className={styles.container}>
      <button
        onClick={toggleLang}
        className={styles.langButtonLogin}
        aria-label={language === "fr" ? "Changer la langue en anglais" : "Switch language to French"}
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
        <p className={styles.loginLink}>{texts.pageTitle}</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Nouveau mot de passe */}
          <div className={styles.formPart}>
            <label className={styles.label}>{texts.passwordLabel}</label>
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder={texts.passwordLabel}
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                aria-label={showPassword ? texts.hidePassword : texts.showPassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirmer le mot de passe */}
          <div className={styles.formPart}>
            <label className={styles.label}>{texts.confirmPasswordLabel}</label>
            <div className={styles.passwordContainer}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder={texts.confirmPasswordLabel}
                className={styles.input}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                aria-label={showConfirmPassword ? texts.hidePassword : texts.showPassword}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.validate}>{texts.validate}</button>
        </form>

        {statusMessage && <p className={styles.statusMessage}>{statusMessage}</p>}

        <a href="/login" className={styles.passwordIssue}>{texts.passwordIssue}</a>
      </div>

      <ChangeLanguageModal
        isOpen={isLangModalOpen}
        onClose={() => setLangModalOpen(false)}
        currentLanguage={language}
      />
    </div>
  );
}
