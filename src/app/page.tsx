"use client";

import Image from "next/image";
import styles from "./page.module.scss";
import Hero from "@/components/Hero/Hero";
import About from "@/components/About/About";
import Numbers from "@/components/Numbers/Numbers";
import Projects from "@/components/Projects/Projects";
import Contact from "@/components/Contact/Contact";
import SecondNav from "@/components/Second-nav/SecondNav";
import Footer from "@/components/Footer/Footer";
import { LanguageProvider } from "./context/LanguageContext";
import UserBar from "@/components/UserBar/UserBar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { EditableContentProvider } from "./context/EditableContentContext";

export default function Home() {
  return (
    <div className={styles.page}>
      <AuthProvider>
        <LanguageProvider>
          <EditableContentProvider>
          <Hero isEditMode={false} />
          <About isEditMode={false} />
          <SecondNav />
          <Numbers />
          <Projects />
          <Contact />
          <Footer />
          </EditableContentProvider>
        </LanguageProvider>
      </AuthProvider>
    </div>
  );
}
