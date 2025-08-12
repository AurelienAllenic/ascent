"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

type Language = "fr" | "en";
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Lire la langue dans l'URL
  const urlLang = searchParams?.get("lang") as Language | null;

  // État local de la langue
  const [language, setLanguageState] = useState<Language>("en");

  // Au premier rendu, définir la langue selon :
  // 1) param lang dans l'URL s'il est valide
  // 2) localStorage sinon
  // 3) "en" par défaut
  useEffect(() => {
    if (urlLang === "fr" || urlLang === "en") {
      setLanguageState(urlLang);
      localStorage.setItem("language", urlLang);
    } else {
      const localLang = (localStorage.getItem("language") as Language) || "en";
      setLanguageState(localLang);

      // Mettre à jour l'URL avec la langue locale si pas déjà présent
      if (!urlLang) {
        const search = new URLSearchParams(window.location.search);
        search.set("lang", localLang);
        router.replace(`${pathname}?${search.toString()}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fonction pour changer la langue (modifie état + URL + localStorage)
  function setLanguage(lang: Language) {
    setLanguageState(lang);
    localStorage.setItem("language", lang);

    const search = new URLSearchParams(window.location.search);
    search.set("lang", lang);

    // On remplace l'URL sans recharger la page
    router.replace(`${pathname}?${search.toString()}`);
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
