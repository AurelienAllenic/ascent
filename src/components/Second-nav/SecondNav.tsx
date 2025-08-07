"use client"; 
import styles from "./secondnav.module.scss";

const navLinks = [
  { label: "home", icon: "/assets/secondNav/home.svg" },
  { label: "about", icon: "/assets/secondNav/about.svg" },
  { label: "numbers", icon: "/assets/secondNav/numbers.svg" },
  { label: "projects", icon: "/assets/secondNav/projects.svg" },
  { label: "contact", icon: "/assets/secondNav/contact.svg" },
];

const SecondNav = () => {
  const handleScroll = (id: string) => {
    console.log(id, "id");
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      element.focus({ preventScroll: true });
    }
  };

  return (
    <nav className={styles.verticalNav} aria-label="Secondary navigation">
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
