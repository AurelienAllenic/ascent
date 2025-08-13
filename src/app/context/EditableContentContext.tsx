"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type EditableContentContextType = {
  editableHome: any;
  setEditableHome: (data: any) => void;
};

const EditableContentContext = createContext<EditableContentContextType | undefined>(undefined);

export function EditableContentProvider({ children }: { children: ReactNode }) {
  const [editableHome, setEditableHome] = useState<any>(null);

  useEffect(() => {
    // fetch initial data depuis le backend
    fetch("/api/homeSection")
      .then(res => res.json())
      .then(data => setEditableHome(data))
      .catch(err => console.error("Erreur fetch editableHome:", err));
  }, []);

  return (
    <EditableContentContext.Provider value={{ editableHome, setEditableHome }}>
      {children}
    </EditableContentContext.Provider>
  );
}

export function useEditableContent() {
  const context = useContext(EditableContentContext);
  if (!context) throw new Error("useEditableContent must be used within EditableContentProvider");
  return context;
}
