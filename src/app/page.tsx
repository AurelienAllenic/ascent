"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { EditableContentProvider } from "./context/EditableContentContext";
import Hero from "@/components/Hero/Hero";
import About from "@/components/About/About";
import Numbers from "@/components/Numbers/Numbers";
import Projects from "@/components/Projects/Projects";
import Contact from "@/components/Contact/Contact";
import SecondNav from "@/components/Second-nav/SecondNav";
import Footer from "@/components/Footer/Footer";
import TrackPageView from "@/components/Analytics/TrackPageView";

export default function Home() {
  return (
    <SessionProvider>
      <AuthProvider>
        <LanguageProvider>
          <EditableContentProvider>
            <TrackPageView />
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
    </SessionProvider>
  );
}
