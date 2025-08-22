"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./login.module.scss";
import { useLanguage } from "@/app/context/LanguageContext";
import ChangeLanguageModal from "../ChangeLanguageModal/ChangeLanguageModal";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Login() {
  const { language, setLanguage } = useLanguage();
  const [isLangModalOpen, setLangModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const texts = {
    emailLabel: language === "fr" ? "Adresse email" : "Email address",
    emailPlaceholder: language === "fr" ? "Votre email" : "Please enter your email",
    passwordLabel: language === "fr" ? "Mot de passe" : "Password",
    passwordPlaceholder: language === "fr" ? "Votre mot de passe" : "Please enter your password",
    loginText: language === "fr" ? "Connexion" : "Login",
    validate: language === "fr" ? "Valider" : "Validate",
    passwordIssue: language === "fr" ? "Mot de passe oublié ?" : "Password forgotten ?",
    toggleLangButton: language === "fr" ? "EN / FR" : "FR / EN",
    showPassword: language === "fr" ? "Afficher le mot de passe" : "Show password",
    hidePassword: language === "fr" ? "Masquer le mot de passe" : "Hide password",
  };

  const toggleLang = () => {
    setLanguage(language === "en" ? "fr" : "en");
    setLangModalOpen(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      if (!res.ok) {
        const text = await res.text();
        setError(text);
        return;
      }
  
      const data = await res.json();
  
      // ⚡ Sauvegarde du token dans le localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
  
      // Redirection après connexion réussie
      router.push("/edit-page");
    } catch (err) {
      console.error(err);
      setError("Erreur serveur");
    }
  };
  

  return (
    <div className={styles.container}>
      <button onClick={toggleLang} className={styles.langButtonLogin} type="button">
        {texts.toggleLangButton}
      </button>

      <Image src="/assets/background.png" alt="Background" fill className={styles.background} priority style={{ zIndex: 1 }} />

      <div className={styles.content}>
        <p className={styles.loginLink}>{texts.loginText}</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formPart}>
            <label className={styles.label} htmlFor="email">{texts.emailLabel}</label>
            <div className={styles.passwordContainer}>
              <input
                id="email"
                type="email"
                placeholder={texts.emailPlaceholder}
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.formPart}>
            <label className={styles.label} htmlFor="password">{texts.passwordLabel}</label>
            <div className={styles.passwordContainer}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={texts.passwordPlaceholder}
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" onClick={togglePasswordVisibility} className={styles.passwordToggle} aria-label={showPassword ? texts.hidePassword : texts.showPassword}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.validate}>{texts.validate}</button>
        </form>

        <a href="/reset-password" className={styles.passwordIssue}>{texts.passwordIssue}</a>
      </div>

      <ChangeLanguageModal isOpen={isLangModalOpen} onClose={() => setLangModalOpen(false)} currentLanguage={language} />
    </div>
  );
}
