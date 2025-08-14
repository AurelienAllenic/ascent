"use client";

import { LanguageProvider } from "../context/LanguageContext";
import { AuthProvider } from "@/app/context/AuthContext";
import { EditableContentProvider } from "../context/EditableContentContext";
import EditComponent from "@/components/EditPage/EditPage";

export default function EditPage() {
  return (
      <AuthProvider>
        <LanguageProvider>
          <EditableContentProvider>
            <EditComponent />
          </EditableContentProvider>
        </LanguageProvider>
      </AuthProvider>
  );
}