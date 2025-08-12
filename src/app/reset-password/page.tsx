"use client";

import { LanguageProvider } from "@/app/context/LanguageContext";
import ResetPassword from "@/components/ResetPassword/ResetPassword";

export default function LoginPage() {
  return (
    <LanguageProvider>
      <ResetPassword />
    </LanguageProvider>
  );
}
