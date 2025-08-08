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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
    <nav
      className={`${styles.verticalNav} ${isVisible ? styles.visible : ""}`}
      aria-label="Secondary navigation"
    >
      {navLinks.map((link, index) => (
        <div
          key={link.label}
          className={styles.navItem}
          style={{ "--order": index } as React.CSSProperties}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => {
            if (hoveredIndex === index) {
              handleScroll(link.label);
            }
          }}
        >
          <img src={link.icon} alt={link.label} className={styles.icon} />
          <span className={styles.label}>{link.label.toUpperCase()}</span>
        </div>
      ))}
    </nav>
  );
};

export default SecondNav;
