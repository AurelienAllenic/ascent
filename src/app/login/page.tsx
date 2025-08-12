"use client";

import { LanguageProvider } from "@/app/context/LanguageContext";
import Login from "@/components/Login/login";

export default function LoginPage() {
  return (
    <LanguageProvider>
      <Login />
    </LanguageProvider>
  );
}
