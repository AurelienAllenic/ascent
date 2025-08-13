"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type EditableContentContextType = {
  editableHome: any;
  setEditableHome: (data: any) => void;
  loading: boolean;
};

const EditableContentContext = createContext<EditableContentContextType | undefined>(undefined);

export function EditableContentProvider({ children }: { children: ReactNode }) {
  const [editableHome, setEditableHome] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Sauvegarde position actuelle
    const scrollY = window.scrollY;
    document.body.style.top = `-${scrollY}px`;
    document.body.style.position = "fixed";
    document.body.style.width = "100%";

    const startTime = Date.now();

    fetch("/api/homeSection")
      .then(res => res.json())
      .then(data => setEditableHome(data))
      .catch(err => console.error("Erreur fetch editableHome:", err))
      .finally(() => {
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, 1000 - elapsed); // min 1 sec

        setTimeout(() => {
          setFadeOut(true); // lance la transition de disparition
          setTimeout(() => {
            setLoading(false);
            // Restauration scroll
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.width = "";
            window.scrollTo(0, scrollY);
          }, 500); // durée de l’animation de fade-out
        }, remainingTime);
      });

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, []);

  if (loading) {
    return (
      <div
        style={{
          opacity: fadeOut ? 0 : 1,
          transition: "opacity 0.5s ease",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          background: "white",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9999,
        }}
      >
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <EditableContentContext.Provider value={{ editableHome, setEditableHome, loading }}>
      {children}
    </EditableContentContext.Provider>
  );
}

export function useEditableContent() {
  const context = useContext(EditableContentContext);
  if (!context) throw new Error("useEditableContent must be used within EditableContentProvider");
  return context;
}
