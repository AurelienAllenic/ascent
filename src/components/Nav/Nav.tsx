"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import styles from "./nav.module.scss";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<"EN/FR" | "FR/EN">("EN/FR");

  const toggleLang = () => {
    setLang((prev) => (prev === "EN/FR" ? "FR/EN" : "EN/FR"));
  };

  const navLinks = ["Home", "About", "Numbers", "Projects", "Contact"];

  return (
    <header className={styles.navbar}>
      <nav className={styles.navContainer}>
        {/* Logo à gauche */}
        <div className={styles.leftContainer}>
          <div className={styles.logo}>ASCENT</div>
        </div>

        {/* Liens desktop */}
        <ul className={styles.navLinks}>
          {navLinks.map((link) => (
            <li key={link} className={styles.navItem}>
              <a href={`#${link.toLowerCase()}`} className={styles.navLink}>
                {link}
              </a>
            </li>
          ))}
        </ul>

        {/* Droite : Contact + Lang switch (desktop) + Burger */}
        <div className={styles.rightContainer}>
          <a href="#contact" className={styles.contactBtnMobile}>
            Contact
          </a>

          {/* Lang switch visible uniquement en desktop */}
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

      {/* Menu mobile */}
      {isOpen && (
        <div className={styles.mobileMenu}>
          {/* Bouton de fermeture en haut à droite */}
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
