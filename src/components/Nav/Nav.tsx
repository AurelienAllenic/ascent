"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import styles from "./nav.module.scss";
import { useLanguage } from "@/app/context/LanguageContext";
import ChangeLanguageModal from "../ChangeLanguageModal/ChangeLanguageModal";
import { useAuth } from "@/app/context/AuthContext";
import { useEditableContent } from "@/app/context/EditableContentContext";
import { useAnalytics } from "@/hooks/useAnalytics";

const NavBar = ({ isEditMode }: { isEditMode?: boolean }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isLangModalOpen, setLangModalOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  const { siteSetting, hasSiteError } = useEditableContent();
  const { trackClick } = useAnalytics();
  const toggleLang = () => {
    trackClick(`language_toggle_${language === "en" ? "fr" : "en"}`);
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
      className={`${isEditMode ? styles.navbarEdit : styles.navbar} ${
        windowWidth < 768 && !isVisible ? styles.mobileBackground : ""
      }`}
      style={hasSiteError ? { top: "40px" } : undefined}
    >
      <nav className={styles.navContainer}>
        <div className={styles.leftContainer}>
          <div className={styles.logo}>{language === "fr" ? siteSetting?.siteTitleFr : siteSetting?.siteTitleEn}</div>
        </div>

        <ul className={styles.navLinks}>
          {navLinks.map(({ id, label }) => (
            <li key={id} className={styles.navItem}>
              <a
                href={`#${id}`}
                className={styles.navLink}
                onClick={(e) => {
                  e.preventDefault();
                  trackClick(`nav_${id}`);
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
              trackClick("nav_contact");
              handleScroll("contact");
            }}
          >
            {language === "fr" ? "Contact" : "Contact"}
          </a>

          <button onClick={toggleLang} className={styles.langSwitch}>
            {language === "fr" ? "FR" : "EN"} / {language === "fr" ? "EN" : "FR"}
          </button>
          {isEditMode ? 
          <></>:
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
        }
           
          

          <button
            className={styles.burgerBtn}
            onClick={() => {
              trackClick("nav_burger");
              setIsOpen((prev) => !prev);
            }}
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
            className={isEditMode ? styles.closeBtnEdit : styles.closeBtn}
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
                  trackClick(`nav_${id}`); // le hook ajoute _mobile + _LANG_* selon viewport et langue
                  handleScroll(id);
                  handleCloseMenu();
                }}
              >
                {label}
              </a>
            ))}
          </div>

          <div className={styles.mobileBottom}>
          {isLoggedIn ? (
            isEditMode ? (
              null
            ) : (
              <button className={styles.loginBtn}>
                {language === "fr" ? "ÉDITER" : "EDIT"}
              </button>
            )
          ) : (
            <a href="/login" className={styles.loginBtn}>
              {language === "fr" ? "CONNEXION" : "LOGIN"}
            </a>
          )}

            
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
