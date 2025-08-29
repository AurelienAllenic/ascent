"use client";

import { LanguageProvider } from "@/app/context/LanguageContext";
import CGUComponent from "@/components/CGU/CGU";
import { EditableContentProvider } from "../context/EditableContentContext";

export default function CGUPage() {
  return (
    <LanguageProvider>
      <EditableContentProvider>
        <CGUComponent />
      </EditableContentProvider>
    </LanguageProvider>
  );
}
