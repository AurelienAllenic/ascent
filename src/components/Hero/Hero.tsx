"use client";

import Image from "next/image";
import NavBar from "../Nav/Nav";
import { useLanguage } from "@/app/context/LanguageContext";
import { useAuth } from "@/app/context/AuthContext";
import { useEditableContent } from "@/app/context/EditableContentContext";
import styles from "./hero.module.scss";

export type HomeSectionType = {
  imageUrl?: string;
  titleEn?: string;
  titleFr?: string;
  subtitleEn?: string;
  subtitleFr?: string;
  contentEn?: string;
  contentFr?: string;
};

type HeroProps = {
  onSave?: (data: HomeSectionType) => Promise<void>;
};

export default function Hero({ onSave }: HeroProps) {
  const { language } = useLanguage();
  const { isLoggedIn } = useAuth();
  const { editableHome, setEditableHome } = useEditableContent();




  const handleChange = (field: keyof HomeSectionType, value: string) => {
    setEditableHome(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSave = async () => {
    if (!editableHome || !onSave) return;
    try {
      await onSave(editableHome);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde :", err);
    }
  };

  const title = language === "fr" ? editableHome.titleFr : editableHome.titleEn;
  const subtitle = language === "fr" ? editableHome.subtitleFr : editableHome.subtitleEn;
  const content = language === "fr" ? editableHome.contentFr : editableHome.contentEn;

  return (
    <div className={styles.heroContainer} id="home">
      <NavBar onSave={handleSave} />

      <Image
        src={editableHome.imageUrl || "/assets/background.png"}
        alt="Background"
        fill
        style={{ objectFit: "cover" }}
        className={styles.background}
      />

      <div className={styles.overlay}></div>

      <div className={styles.content}>
        <div className={styles.mainTitleContainer}>
          {isLoggedIn ? (
            <input
              className={styles.mainTitle}
              value={title || ""}
              onChange={(e) =>
                handleChange(language === "fr" ? "titleFr" : "titleEn", e.target.value)
              }
            />
          ) : (
            <h1 className={styles.mainTitle}>{title}</h1>
          )}
        </div>

        <div className={styles.blockContent}>
          {isLoggedIn ? (
            <>
              <textarea
                className={styles.blockContentTitle}
                value={subtitle || ""}
                onChange={(e) =>
                  handleChange(language === "fr" ? "subtitleFr" : "subtitleEn", e.target.value)
                }
              />
              <textarea
                className={styles.blockContentContent}
                value={content || ""}
                onChange={(e) =>
                  handleChange(language === "fr" ? "contentFr" : "contentEn", e.target.value)
                }
              />
            </>
          ) : (
            <>
              <h2 className={styles.blockContentTitle}>{subtitle}</h2>
              <p className={styles.blockContentContent}>{content}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
