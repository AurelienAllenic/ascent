"use client";
import { useEffect, useState } from "react";
import styles from "./secondnav.module.scss";

const navLinks = [
  { label: "home", icon: "/assets/secondNav/home.svg" },
  { label: "about", icon: "/assets/secondNav/about.svg" },
  { label: "numbers", icon: "/assets/secondNav/numbers.svg" },
  { label: "projects", icon: "/assets/secondNav/projects.svg" },
  { label: "contact", icon: "/assets/secondNav/contact.svg" },
];

const SecondNav = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const homeSection = document.getElementById("home");
    if (!homeSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isHomeVisible = entry.isIntersecting;
        setIsVisible(!isHomeVisible);
      },
      {
        threshold: 0.3, // Si 30% de home est visible → on cache la nav
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
    <nav
      className={`${styles.verticalNav} ${isVisible ? styles.visible : ""}`}
      aria-label="Secondary navigation"
    >
      {navLinks.map((link, index) => (
        <div
          key={link.label}
          className={styles.navItem}
          style={{ "--order": index } as React.CSSProperties}
        >
          <img src={link.icon} alt={link.label} className={styles.icon} />
          <button
            type="button"
            className={styles.label}
            onClick={() => handleScroll(link.label)}
          >
            {link.label.toUpperCase()}
          </button>
        </div>
      ))}
    </nav>
  );
};

export default SecondNav;
