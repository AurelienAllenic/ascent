"use client";

import React, { useEffect, useState } from "react";
import styles from "./changeLanguageModal.module.scss";

interface ChangeLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: string;
}

export default function ChangeLanguageModal({
  isOpen,
  onClose,
  currentLanguage,
}: ChangeLanguageModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      document.body.style.overflow = "hidden";

      const timer = setTimeout(() => {
        onClose();
      }, 1000);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    } else if (visible) {
      // Si isOpen est false mais la modale est visible, lance le fade-out
      const timeout = setTimeout(() => setVisible(false), 300); // durée fade-out en ms
      document.body.style.overflow = "";

      return () => clearTimeout(timeout);
    }
  }, [isOpen, onClose, visible]);

  if (!visible) return null;

  return (
    <div
      className={`${styles.backdrop} ${isOpen ? styles.fadeIn : styles.fadeOut}`}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <h2 id="modal-title" className={styles.titleModal}>
        {currentLanguage === "fr"
          ? "Langue changée : français"
          : "Language changed : english"}
      </h2>
    </div>
  );
}
