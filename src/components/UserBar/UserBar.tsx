import { useState, useEffect } from "react";
import { useEditableContent } from "@/app/context/EditableContentContext";
import { useAuth } from "@/app/context/AuthContext";
import { useLanguage } from "@/app/context/LanguageContext";
import styles from "./userBar.module.scss";
import { CiSaveDown1 } from "react-icons/ci";
import { IoLogOutOutline } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { IoBarChartSharp } from "react-icons/io5";

export default function UserBar() {
  const { logout } = useAuth();
  const { editableHome, editableAbout, editableNumberSection, projects, setProjects, contactSection, setSaving } = useEditableContent();
  const { language } = useLanguage();

  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [messageConnexion, setMessageConnexion] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(false);

  const MIN_LOADER_MS = 1600;
  const FADE_MS = 320;

  useEffect(() => {
    if (isSaving && !loaderVisible) {
      const id = requestAnimationFrame(() => {
        setLoaderVisible(true);
      });
      return () => cancelAnimationFrame(id);
    }
    if (!isSaving) setLoaderVisible(false);
  }, [isSaving]);

  const handleSave = async () => {
    const startTime = Date.now();
    setIsSaving(true);
    setSaving(true);
    try {
      // Sauvegarde pour Home
      if (editableHome) {
        const homeBody: Record<string, any> = {};
        Object.entries(editableHome).forEach(([key, value]) => {
          if (value !== undefined) homeBody[key] = value;
        });
        const homeRes = await fetch("/api/homeSection", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(homeBody),
        });

        if (!homeRes.ok) {
          const errorData = await homeRes.json().catch(() => null);
          throw new Error(errorData?.message || "Erreur inconnue (home)");
        }
      }
      // Sauvegarde pour About
      if (editableAbout) {
        const aboutBody: Record<string, any> = {};
        Object.entries(editableAbout).forEach(([key, value]) => {
          if (value !== undefined) aboutBody[key] = value;
        });
        const aboutRes = await fetch("/api/aboutSection", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(aboutBody),
        });

        if (!aboutRes.ok) {
          const errorData = await aboutRes.json().catch(() => null);
          throw new Error(errorData?.message || "Erreur inconnue (about)");
        }
      }

      // Sauvegarde pour NumberSection
      if (editableNumberSection) {
        const numberBody: Record<string, any> = {};
        Object.entries(editableNumberSection).forEach(([key, value]) => {
          if (value !== undefined) numberBody[key] = value;
        });
        const numberRes = await fetch("/api/numberSection", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(numberBody),
        });

        if (!numberRes.ok) {
          const errorData = await numberRes.json().catch(() => null);
          throw new Error(errorData?.message || "Erreur inconnue (numbers)");
        }
      }

      // Sauvegarde pour Projects (même principe : contexte → PATCH par projet)
      if (projects && projects.length > 0) {
        for (let i = 0; i < projects.length; i++) {
          const project = projects[i];
          if (!project.id) continue; // nouveaux projets : créés via le formulaire POST, pas ici
          const patchBody = {
            id: project.id,
            titleEn: project.titleEn,
            titleFr: project.titleFr,
            generalDescriptionEn: project.generalDescriptionEn ?? "",
            generalDescriptionFr: project.generalDescriptionFr ?? "",
            images: project.images.map((img) => ({
              id: img.id,
              descriptionEn: img.descriptionEn ?? "",
              descriptionFr: img.descriptionFr ?? "",
            })),
          };
          const projectRes = await fetch("/api/projectsSection", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patchBody),
          });
          if (!projectRes.ok) {
            const errorData = await projectRes.json().catch(() => null);
            throw new Error(errorData?.error || errorData?.message || "Erreur (projects)");
          }
          const updated = await projectRes.json();
          setProjects((prev) =>
            prev ? prev.map((p) => (p.id === updated.id ? updated : p)) : null
          );
        }
      }

      // Sauvegarde pour Contact
      if (contactSection?.id) {
        const contactBody: Record<string, unknown> = {
          id: contactSection.id,
          imageUrl: contactSection.imageUrl ?? (contactSection as { image_url?: string }).image_url,
          titleEn: contactSection.titleEn,
          titleFr: contactSection.titleFr,
          titleEn2: contactSection.titleEn2,
          titleFr2: contactSection.titleFr2,
          buttonTextEn: contactSection.buttonTextEn,
          buttonTextFr: contactSection.buttonTextFr,
          buttonLink: contactSection.buttonLink ?? "",
          formTitle1En: contactSection.formTitle1En,
          formTitle2En: contactSection.formTitle2En,
          formTitle1Fr: contactSection.formTitle1Fr,
          formTitle2Fr: contactSection.formTitle2Fr,
          submitButtonTextEn: contactSection.submitButtonTextEn,
          submitButtonTextFr: contactSection.submitButtonTextFr,
        };
        const contactRes = await fetch("/api/contactSection", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(contactBody),
        });
        if (!contactRes.ok) {
          const errorData = await contactRes.json().catch(() => null);
          throw new Error(errorData?.message || "Erreur (contact)");
        }
      }

      setIsError(false);
      setMessage(language === "fr" ? "Modifications enregistrées !" : "Changes saved!");
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setIsError(true);
      setMessage(language === "fr" ? "Erreur lors de la sauvegarde" : "Error saving changes");
      setTimeout(() => setMessage(null), 5000);
    } finally {
      const elapsed = Date.now() - startTime;
      const wait = Math.max(0, MIN_LOADER_MS - elapsed);
      await new Promise((r) => setTimeout(r, wait));
      setIsSaving(false);
      setSaving(false);
    }
  };

  const handleSee = () => {
    window.open("/", "_blank");
  };

  const toggleMessage = () => {
    setMessageConnexion(!messageConnexion);
  };

  const loaderPath =
    "M 56.742 51.758 L 34 74.516 34 102.258 L 34 130 47.500 130 L 61 130 61 114 L 61 98 68 98 L 75 98 75 114 L 75 130 100 130 L 125 130 125 102.242 L 125 74.484 102.242 51.742 L 79.484 29 56.742 51.758 M 68.734 43.765 L 59.007 53.529 75.503 70.003 L 92 86.477 92 106.739 L 92 127 107 127 L 122 127 122 101.241 L 122 75.482 101.241 54.741 C 89.824 43.333, 80.028 34, 79.473 34 C 78.917 34, 74.085 38.394, 68.734 43.765 M 46.735 65.764 L 37 75.536 37 101.268 L 37 127 40 127 L 43 127 43 106.731 L 43 86.462 52.984 76.516 C 59.644 69.881, 63.302 66.902, 63.969 67.569 C 64.637 68.237, 61.811 71.715, 55.485 78.015 L 46 87.460 46 107.230 L 46 127 51.975 127 L 57.949 127 58.225 111.250 L 58.500 95.500 68 95.500 L 77.500 95.500 77.775 111.250 L 78.051 127 83.525 127 L 89 127 89 107.739 L 89 88.477 72.735 72.235 L 56.470 55.992 46.735 65.764";

  return (
    <>
      {isSaving && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "white",
            pointerEvents: "all",
            opacity: loaderVisible ? 1 : 0,
            transition: `opacity ${FADE_MS}ms ease-out`,
          }}
        >
          <style>{`
            @keyframes userBarLoaderPathDraw {
              0% { stroke-dashoffset: 1; }
              50% { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: 1; }
            }
          `}</style>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="159"
            height="159"
            viewBox="0 0 159 159"
            style={{ overflow: "visible" }}
          >
            <path
              d={loaderPath}
              fill="none"
              stroke="#000000"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset="1"
              style={{ animation: "userBarLoaderPathDraw 2.4s ease-in-out infinite" }}
            />
          </svg>
        </div>
      )}
    <div className={styles.userBar}>
      <h2 className={styles.userBarText}>
        <FaCheckCircle className={styles.icon} color="rgb(33 142 73)" onClick={toggleMessage}/>
        {
          messageConnexion && (
            <span className={styles.hoverText}>
              {language === "fr" ? "connecté !" : "connected !"}
            </span>
          )
        }
      </h2>
      <div className={styles.innerUserBar}>
        <button className={styles.userBarButtonSave} onClick={handleSave}>
          {language === "fr" ? "Sauvegarder" : "Save"}
          <CiSaveDown1 className={styles.userBarButtonIcon} />
        </button>
        <button className={styles.userBarButtonSee} onClick={handleSee}>
          {language === "fr" ? "Voir" : "See"}
          <FaRegEye className={styles.userBarButtonIcon} />
        </button>
        <a
          href="/analytics"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.userBarButtonAnalytics}
        >
          Analytics
          <IoBarChartSharp className={styles.userBarButtonIcon} />
        </a>
        <button className={styles.userBarButtonLogout} onClick={logout}>
          {language === "fr" ? "Se déconnecter" : "Logout"}
          <IoLogOutOutline className={styles.userBarButtonIcon} />
        </button>
      </div>

      {message && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            padding: "10px 20px",
            backgroundColor: isError ? "#f87171" : "#4ade80",
            color: "#fff",
            borderRadius: "5px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            zIndex: 1000,
          }}
        >
          {message}
        </div>
      )}
    </div>
    </>
  );
}