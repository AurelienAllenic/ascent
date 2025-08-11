"use client";

import { useEffect, useState } from "react";
import styles from "./secondnav.module.scss";
import { useLanguage } from "@/app/context/LanguageContext";
import ChangeLanguageModal from "../ChangeLanguageModal/ChangeLanguageModal";

const navLinks = [
  { icon: "/assets/secondNav/home.svg", labelFr: "Accueil", labelEn: "Home" },
  { icon: "/assets/secondNav/about.svg", labelFr: "À propos", labelEn: "About" },
  { icon: "/assets/secondNav/numbers.svg", labelFr: "Chiffres", labelEn: "Numbers" },
  { icon: "/assets/secondNav/projects.svg", labelFr: "Projets", labelEn: "Projects" },
  { icon: "/assets/secondNav/contact.svg", labelFr: "Contact", labelEn: "Contact" },
];

const SecondNav = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { language, setLanguage } = useLanguage();
  const [isLangModalOpen, setLangModalOpen] = useState(false);
  const toggleLang = () => {
    setLanguage(language === "en" ? "fr" : "en");
    setLangModalOpen(true);
  };


  useEffect(() => {
    const homeSection = document.getElementById("home");
    if (!homeSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isHomeVisible = entry.isIntersecting;
        setIsVisible(!isHomeVisible);
      },
      {
        threshold: 0.05,
      }
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

  return (
    <>
      <nav
        className={`${styles.verticalNav} ${isVisible ? styles.visible : ""}`}
        aria-label="Secondary navigation"
      >
        {navLinks.map((link, index) => (
          <>
            <div
              key={link.labelFr}
              className={styles.navItem}
              style={{ "--order": index } as React.CSSProperties}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => {
                if (hoveredIndex === index) {
                  handleScroll(link.labelFr);
                }
              }}
            >
              <img src={link.icon} alt={language === "fr" ? link.labelFr : link.labelEn} className={styles.icon} />
              <span className={styles.label}>{language === "fr" ? link.labelFr : link.labelEn}</span>
            </div>
          </>
        ))}
        <div className={styles.navItemLang} style={{ "--order": 5 } as React.CSSProperties}>
          <button onClick={toggleLang} className={styles.navItemLangSwitch}>
            {language === "fr" ? "FR / EN" : "EN / FR"}
          </button>
        </div>
      </nav>
      <ChangeLanguageModal
      isOpen={isLangModalOpen}
      onClose={() => setLangModalOpen(false)}
      currentLanguage={language}
      onChangeLanguage={(lang) => setLanguage(lang)}
    />
  </>
  );
};

export default SecondNav;
