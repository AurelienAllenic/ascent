"use client";

import Image from "next/image";
import styles from "@/app/page.module.scss";
import Hero from "@/components/Hero/Hero";
import About from "@/components/About/About";
import Numbers from "@/components/Numbers/Numbers";
import Projects from "@/components/Projects/Projects";
import Contact from "@/components/Contact/Contact";
import SecondNav from "@/components/Second-nav/SecondNav";
import Footer from "@/components/Footer/Footer";
import { LanguageProvider } from "@/app/context/LanguageContext";
import UserBar from "@/components/UserBar/UserBar";
import { AuthProvider, useAuth } from "@/app/context/AuthContext";
import { EditableContentProvider } from "@/app/context/EditableContentContext";

export default function EditComponent() {
  return (
    <div className={styles.page}>
      <AuthProvider>
        <LanguageProvider>
          <EditableContentProvider>
            <ConditionalContent />
          </EditableContentProvider>
        </LanguageProvider>
      </AuthProvider>
    </div>
  );
}

function ConditionalContent() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) return null; // ou un message "connectez-vous"

  return (
    <>
      <UserBar />
      <Hero isEditMode={true} />
      <About isEditMode={true} />
      <SecondNav />
      <Numbers isEditMode={true}/>
      {/* <Projects isEditMode={true}/> */}
      <Projects />
      <Contact />
      <Footer />
    </>
  );
}
