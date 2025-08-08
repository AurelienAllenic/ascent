"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import styles from "./nav.module.scss";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<"EN/FR" | "FR/EN">("EN/FR");
  const [isVisible, setIsVisible] = useState(true);
  const [windowWidth, setWindowWidth] = useState(0);

  const toggleLang = () => {
    setLang((prev) => (prev === "EN/FR" ? "FR/EN" : "EN/FR"));
  };

  const navLinks = ["Home", "About", "Numbers", "Projects", "Contact"];

  // Mettre à jour windowWidth
  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateWidth = () => setWindowWidth(window.innerWidth);
      updateWidth(); // Appel initial
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }
  }, []);

  // Observer pour la section #home (desktop et mobile)
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
  }, []); // Pas de dépendance à windowWidth pour appliquer l'observer partout

  // Masquer la barre en desktop si hors de #home
  if (windowWidth >= 768 && !isVisible) return null;

  return (
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
          {navLinks.map((link) => (
            <li key={link} className={styles.navItem}>
              <a href={`#${link.toLowerCase()}`} className={styles.navLink}>
                {link}
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.rightContainer}>
          <a href="#contact" className={styles.contactBtnMobile}>
            Contact
          </a>

          <button onClick={toggleLang} className={styles.langSwitch}>
            {lang}
          </button>

          <button
            className={styles.burgerBtn}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div
          className={`${styles.mobileMenu} ${
            !isVisible ? styles.mobileBackground : ""
          }`}
        >
          <button
            className={styles.closeBtn}
            onClick={() => setIsOpen(false)}
            aria-label="Fermer le menu"
          >
            <X size={28} />
          </button>

          <div className={styles.mobileLinks}>
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className={styles.mobileNavLink}
                onClick={() => setIsOpen(false)}
              >
                {link}
              </a>
            ))}
          </div>

          <div className={styles.mobileBottom}>
            <a href="/login" className={styles.loginBtn}>
              LOGIN
            </a>
            <button onClick={toggleLang} className={styles.langBtnMobile}>
              {lang}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;