import { useState } from "react";
import { useEditableContent } from "@/app/context/EditableContentContext";
import { useAuth } from "@/app/context/AuthContext";
import { useLanguage } from "@/app/context/LanguageContext";
import styles from "./userBar.module.scss";
import { CiSaveDown1 } from "react-icons/ci";
import { IoLogOutOutline } from "react-icons/io5"

export default function UserBar() {
  const { logout } = useAuth();
  const { editableHome } = useEditableContent();
  const { language } = useLanguage();

  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleSave = async () => {
    try {
      // On ne prend que les champs définis
      const body: Record<string, any> = {};
      Object.entries(editableHome || {}).forEach(([key, value]) => {
        if (value !== undefined) body[key] = value;
      });
      console.log("body front =>", body);
      const res = await fetch("/api/homeSection", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
  
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Erreur inconnue");
      }
  
      setIsError(false);
      setMessage(language === "fr" ? "Modifications enregistrées !" : "Changes saved!");
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setIsError(true);
      setMessage(language === "fr" ? "Erreur lors de la sauvegarde" : "Error saving changes");
      setTimeout(() => setMessage(null), 5000);
    }
  };
  
  
  

  return (
    <div className={styles.userBar}>
        <h2 className={styles.userBarText}>{language === "fr" ? "Vous êtes connecté !" : "You are connected !"}</h2>
      <div className={styles.innerUserBar}>
        <button className={styles.userBarButtonSave} onClick={handleSave}>
            {language === "fr" ? "Sauvegarder" : "Save"}<CiSaveDown1 className={styles.userBarButtonIcon}/>
        </button>
        <button className={styles.userBarButtonLogout} onClick={logout}>
            {language === "fr" ? "Se déconnecter" : "Logout"}< IoLogOutOutline className={styles.userBarButtonIcon}/> 
        </button>
      </div>
     

      {message && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            padding: "10px 20px",
            backgroundColor: isError ? "#f87171" : "#4ade80", // rouge ou vert
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
  );
}
