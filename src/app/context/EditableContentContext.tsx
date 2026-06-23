"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { HomeSectionType } from "@/components/Hero/Hero";
import type { AboutSectionType } from "@/components/About/About";
import type { NumberSectionType } from "@/components/Numbers/Numbers";
import type { FooterSectionType } from "@/components/Footer/Footer";
import type { CguSectionType } from "@/components/CGU/CGU";
import type { ContactSectionType } from "@/components/Contact/Contact";

// Définir le type pour les projets
export interface ProjectType {
  id?: string;
  titleEn: string;
  titleFr: string;
  featuredImage: string;
  generalDescriptionEn?: string;
  generalDescriptionFr?: string;
  images: Array<{
    id?: string;
    url: string;
    descriptionEn: string;
    descriptionFr: string;
  }>;
}

export interface SiteSettingType {
  siteTitleEn: string;
  siteTitleFr: string;
  updatedAt: string;
}


// Mettre à jour le type du contexte
type EditableContentContextType = {
  editableHome: HomeSectionType | null;
  setEditableHome: React.Dispatch<React.SetStateAction<HomeSectionType | null>>;
  editableAbout: AboutSectionType | null;
  setEditableAbout: React.Dispatch<React.SetStateAction<AboutSectionType | null>>;
  editableNumberSection: NumberSectionType | null;
  setEditableNumberSection: React.Dispatch<React.SetStateAction<NumberSectionType | null>>;
  projects: ProjectType[] | null;
  setProjects: React.Dispatch<React.SetStateAction<ProjectType[] | null>>;
  loading: boolean;
  error: string | null;
  footer: FooterSectionType | null;
  setFooter: React.Dispatch<React.SetStateAction<FooterSectionType | null>>;
  cgu: CguSectionType[] | null;
  setCgu: React.Dispatch<React.SetStateAction<CguSectionType[] | null>>;
  siteSetting: SiteSettingType | null;
  setSiteSetting: React.Dispatch<React.SetStateAction<SiteSettingType | null>>;
  contactSection: ContactSectionType | null;
  setContactSection: React.Dispatch<React.SetStateAction<ContactSectionType | null>>;
  saving: boolean;
  setSaving: React.Dispatch<React.SetStateAction<boolean>>;
  hasSiteError: boolean;
};

const FALLBACK_HOME: HomeSectionType = {
  imageUrl: "/assets/background.png",
  titleEn: "Title",
  titleFr: "Titre",
  subtitleEn: "Subtitle",
  subtitleFr: "Sous-titre",
  contentEn: "Content unavailable.",
  contentFr: "Contenu indisponible.",
};

const FALLBACK_ABOUT: AboutSectionType = {
  id: "",
  leftPartTitleEn: "Title",
  leftPartTitleFr: "Titre",
  rightPartContent1En: "Content unavailable.",
  rightPartContent1Fr: "Contenu indisponible.",
  btnTextEn: "Learn more",
  btnTextFr: "En savoir plus",
  btnLink: "#",
};

const FALLBACK_NUMBERS: NumberSectionType = {
  id: "",
  userId: "",
  updatedAt: new Date(),
  cards: [
    { id: "1", numberSectionId: "", number: "—", textEn: "Stat", textFr: "Statistique", size: "medium" },
    { id: "2", numberSectionId: "", number: "—", textEn: "Stat", textFr: "Statistique", size: "medium" },
    { id: "3", numberSectionId: "", number: "—", textEn: "Stat", textFr: "Statistique", size: "medium" },
  ],
};

const FALLBACK_FOOTER: FooterSectionType = {
  cguButtonTextEn: "Terms & Conditions",
  cguButtonTextFr: "CGU",
  cguButtonLink: "/cgu",
  showCguButton: true,
  copyrightTextEn: `© ${new Date().getFullYear()}`,
  copyrightTextFr: `© ${new Date().getFullYear()}`,
};

const FALLBACK_CGU: CguSectionType[] = [
  {
    sectionNumber: 1,
    titleEn: "Content temporarily unavailable",
    titleFr: "Contenu temporairement indisponible",
    contentEn: "The terms of use are currently unavailable. Please try again later.",
    contentFr: "Les conditions générales d'utilisation sont temporairement indisponibles. Veuillez réessayer ultérieurement.",
  },
];

const FALLBACK_CONTACT: ContactSectionType = {
  id: "",
  titleEn: "Contact",
  titleFr: "Contact",
  titleEn2: "Get in touch",
  titleFr2: "Prenez contact",
  buttonTextEn: "Send",
  buttonTextFr: "Envoyer",
  buttonLink: "#",
  formTitle1En: "Contact",
  formTitle2En: "Fill in the form",
  formTitle1Fr: "Contact",
  formTitle2Fr: "Remplissez le formulaire",
  submitButtonTextEn: "Send",
  submitButtonTextFr: "Envoyer",
  formFields: [],
};

const FALLBACK_SITE_SETTING: SiteSettingType = {
  siteTitleEn: "Ascent",
  siteTitleFr: "Ascent",
  updatedAt: new Date().toISOString(),
};

const EditableContentContext = createContext<EditableContentContextType | undefined>(undefined);

export function EditableContentProvider({ children }: { children: ReactNode }) {
  const [editableHome, setEditableHome] = useState<HomeSectionType | null>(null);
  const [editableAbout, setEditableAbout] = useState<AboutSectionType | null>(null);
  const [editableNumberSection, setEditableNumberSection] = useState<NumberSectionType | null>(null);
  const [projects, setProjects] = useState<ProjectType[] | null>(null);
  const [footer, setFooter] = useState<FooterSectionType | null>(null);
  const [cgu, setCgu] = useState<CguSectionType[] | null>(null);
  const [siteSetting, setSiteSetting] = useState<SiteSettingType | null>(null);
  const [contactSection, setContactSection] = useState<ContactSectionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [pageRevealed, setPageRevealed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedSections, setFailedSections] = useState<string[]>([]);

  useEffect(() => {
    if (!loading && !pageRevealed) {
      const id = requestAnimationFrame(() => {
        setPageRevealed(true);
      });
      return () => cancelAnimationFrame(id);
    }
  }, [loading, pageRevealed]);

  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.top = `-${scrollY}px`;
    document.body.style.position = "fixed";
    document.body.style.width = "100%";

    const startTime = Date.now();

    const safeFetch = (url: string, transform?: (data: unknown) => unknown) =>
      fetch(url)
        .then(res => (res.ok ? res.json() : Promise.reject(new Error(`Failed to fetch ${url}`))))
        .then(data => (transform ? transform(data) : data))
        .catch(() => null);

    Promise.allSettled([
      safeFetch("/api/homeSection"),
      safeFetch("/api/aboutSection"),
      safeFetch("/api/numberSection"),
      safeFetch("/api/projectsSection", (data: unknown) => (data as { projects: unknown }).projects),
      safeFetch("/api/footer"),
      safeFetch("/api/cgu"),
      safeFetch("/api/siteSettings"),
      safeFetch("/api/contactSection"),
    ])
      .then(([homeRes, aboutRes, numberRes, projectsRes, footerRes, cguRes, siteSettingRes, contactRes]) => {
        const failed: string[] = [];
        const resolve = <T,>(res: PromiseSettledResult<T>, fallback: T, name: string): T => {
          if (res.status === "fulfilled" && res.value !== null) return res.value;
          failed.push(name);
          return fallback;
        };
        setEditableHome(resolve(homeRes, FALLBACK_HOME, "home") as HomeSectionType);
        setEditableAbout(resolve(aboutRes, FALLBACK_ABOUT, "about") as AboutSectionType);
        setEditableNumberSection(resolve(numberRes, FALLBACK_NUMBERS, "numbers") as NumberSectionType);
        setProjects(resolve(projectsRes, [], "projects") as ProjectType[]);
        setFooter(resolve(footerRes, FALLBACK_FOOTER, "footer") as FooterSectionType);
        setCgu(resolve(cguRes, FALLBACK_CGU, "cgu") as CguSectionType[]);
        setSiteSetting(resolve(siteSettingRes, FALLBACK_SITE_SETTING, "settings") as SiteSettingType);
        setContactSection(resolve(contactRes, FALLBACK_CONTACT, "contact") as ContactSectionType);
        if (failed.length > 0) setFailedSections(failed);
      })
      .finally(() => {
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, 1000 - elapsed);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            setLoading(false);
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.width = "";
            window.scrollTo(0, scrollY);
          }, 500);
        }, remainingTime);
      });

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, []);

  const showLoader = loading || saving;
  const loaderOpacity = loading && fadeOut ? 0 : 1;

  const loaderOverlay = showLoader ? (
    <div
      key="loader-overlay"
      style={{
        opacity: loaderOpacity,
        transition: "opacity 0.3s ease",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        background: "white",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 99999,
        pointerEvents: "all",
      }}
    >
      <style>{`
        @keyframes loaderPathDraw {
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
        version="1.1"
        style={{ overflow: "visible" }}
      >
        <path
          d="M 56.742 51.758 L 34 74.516 34 102.258 L 34 130 47.500 130 L 61 130 61 114 L 61 98 68 98 L 75 98 75 114 L 75 130 100 130 L 125 130 125 102.242 L 125 74.484 102.242 51.742 L 79.484 29 56.742 51.758 M 68.734 43.765 L 59.007 53.529 75.503 70.003 L 92 86.477 92 106.739 L 92 127 107 127 L 122 127 122 101.241 L 122 75.482 101.241 54.741 C 89.824 43.333, 80.028 34, 79.473 34 C 78.917 34, 74.085 38.394, 68.734 43.765 M 46.735 65.764 L 37 75.536 37 101.268 L 37 127 40 127 L 43 127 43 106.731 L 43 86.462 52.984 76.516 C 59.644 69.881, 63.302 66.902, 63.969 67.569 C 64.637 68.237, 61.811 71.715, 55.485 78.015 L 46 87.460 46 107.230 L 46 127 51.975 127 L 57.949 127 58.225 111.250 L 58.500 95.500 68 95.500 L 77.500 95.500 77.775 111.250 L 78.051 127 83.525 127 L 89 127 89 107.739 L 89 88.477 72.735 72.235 L 56.470 55.992 46.735 65.764"
          fill="none"
          stroke="#000000"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset="1"
          style={{
            animation: "loaderPathDraw 2.4s ease-in-out infinite",
          }}
        />
      </svg>
    </div>
  ) : null;

  if (loading && !saving) {
    return <>{loaderOverlay}</>;
  }

  const errorBanner = failedSections.length > 0 ? (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 99998,
      background: "#c0392b",
      color: "white",
      textAlign: "center",
      padding: "10px 16px",
      fontSize: "14px",
      fontFamily: "sans-serif",
    }}>
      ⚠️ Le site rencontre un problème de chargement. Certaines sections affichent du contenu par défaut.
    </div>
  ) : null;

  return (
    <EditableContentContext.Provider
      value={{
        editableHome,
        setEditableHome,
        editableAbout,
        setEditableAbout,
        editableNumberSection,
        setEditableNumberSection,
        projects,
        setProjects,
        loading,
        error,
        footer,
        setFooter,
        cgu,
        setCgu,
        siteSetting,
        setSiteSetting,
        contactSection,
        setContactSection,
        saving,
        setSaving,
        hasSiteError: failedSections.length > 0,
      }}
    >
      {errorBanner}
      <div
        style={{
          opacity: pageRevealed ? 1 : 0,
          transition: "opacity 0.35s ease-out",
        }}
      >
        {children}
      </div>
      {loaderOverlay}
    </EditableContentContext.Provider>
  );
}

export function useEditableContent() {
  const context = useContext(EditableContentContext);
  if (!context) throw new Error("useEditableContent must be utilisé dans EditableContentProvider");
  return context;
}