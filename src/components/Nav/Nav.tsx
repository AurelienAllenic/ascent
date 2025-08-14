"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import styles from "./nav.module.scss";
import { useLanguage } from "@/app/context/LanguageContext";
import ChangeLanguageModal from "../ChangeLanguageModal/ChangeLanguageModal";
import { useAuth } from "@/app/context/AuthContext";

const NavBar = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isLangModalOpen, setLangModalOpen] = useState(false);
  const { isLoggedIn } = useAuth();

  console.log(isLoggedIn, "isLoggedIn");

  const toggleLang = () => {
    setLanguage(language === "en" ? "fr" : "en");
    setLangModalOpen(true);
  };

  const navLinks = [
    { id: "home", label: language === "fr" ? "Accueil" : "Home" },
    { id: "about", label: language === "fr" ? "À propos" : "About" },
    { id: "numbers", label: language === "fr" ? "Chiffres" : "Numbers" },
    { id: "projects", label: language === "fr" ? "Projets" : "Projects" },
    { id: "contact", label: language === "fr" ? "Contact" : "Contact" },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateWidth = () => setWindowWidth(window.innerWidth);
      updateWidth();
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }
  }, []);

  useEffect(() => {
    const homeSection = document.getElementById("home");
    if (!homeSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(homeSection);
    return () => observer.disconnect();
  }, []);

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      element.focus({ preventScroll: true });
    }
  };

  const handleCloseMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300);
  };

  if (windowWidth >= 768 && !isVisible) return null;

  return (
    <>
    <header
      className={`${styles.navbar} ${
        windowWidth < 768 && !isVisible ? styles.mobileBackground : ""
      }`}
    >
      <nav className={styles.navContainer}>
        <div className={styles.leftContainer}>
          <div className={styles.logo}>ASCENT</div>
        </div>

        <ul className={styles.navLinks}>
          {navLinks.map(({ id, label }) => (
            <li key={id} className={styles.navItem}>
              <a
                href={`#${id}`}
                className={styles.navLink}
                onClick={(e) => {
                  e.preventDefault();
                  handleScroll(id);
                }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.rightContainer}>
          <a
            href="#contact"
            className={styles.contactBtnMobile}
            onClick={(e) => {
              e.preventDefault();
              handleScroll("contact");
            }}
          >
            {language === "fr" ? "Contact" : "Contact"}
          </a>

          <button onClick={toggleLang} className={styles.langSwitch}>
            {language === "fr" ? "FR" : "EN"} / {language === "fr" ? "EN" : "FR"}
          </button>
            <button className={styles.loginLinkNotNav}> {isLoggedIn ? <a
            href="/edit-page"
            className={styles.loginBtn}
          >
            {language === "fr" ? "EDITER" : "EDIT"}
          </a>: 
            <a
            href="/login"
            className={styles.loginBtn}
          >
            {language === "fr" ? "CONNEXION" : "LOGIN"}
          </a>
          }</button>
          

          <button
            className={styles.burgerBtn}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={language === "fr" ? "Ouvrir/Fermer le menu" : "Toggle menu"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div
          className={`${styles.mobileMenu} ${
            windowWidth < 768 && !isVisible ? styles.mobileBackground : ""
          } ${isClosing ? styles.closing : ""}`}
        >
          <button
            className={styles.closeBtn}
            onClick={handleCloseMenu}
            aria-label={language === "fr" ? "Fermer le menu" : "Close menu"}
          >
            <X size={28} />
          </button>

          <div className={styles.mobileLinks}>
            {navLinks.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className={styles.mobileNavLink}
                onClick={(e) => {
                  e.preventDefault();
                  handleScroll(id);
                  handleCloseMenu();
                }}
              >
                {label}
              </a>
            ))}
          </div>

          <div className={styles.mobileBottom}>
            {isLoggedIn ? <a
            href="/edit-page"
            className={styles.loginBtn}
          >
            {language === "fr" ? "EDITER" : "EDIT"}
          </a>: 
            <a
            href="/login"
            className={styles.loginBtn}
          >
            {language === "fr" ? "CONNEXION" : "LOGIN"}
          </a>
          }
            
            <button onClick={toggleLang} className={styles.langBtnMobile}>
              {language === "fr" ? "FR/EN" : "EN/FR"}
            </button>
          </div>
        </div>
      )}
    </header>
    <ChangeLanguageModal
    isOpen={isLangModalOpen}
    onClose={() => setLangModalOpen(false)}
    currentLanguage={language}
  />
  </>
  );
};

export default NavBar;
