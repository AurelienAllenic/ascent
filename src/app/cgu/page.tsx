"use client";

import { LanguageProvider } from "@/app/context/LanguageContext";
import CGUComponent from "@/components/CGU/CGU";

export default function CGUPage() {
  return (
    <LanguageProvider>
      <CGUComponent />
    </LanguageProvider>
  );
}
