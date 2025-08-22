"use client";

import { LanguageProvider } from "@/app/context/LanguageContext";
import ForgotPassword from "@/components/ForgotPassword/ForgotPassword";

export default function ForgotPasswordPage() {
  return (
    <LanguageProvider>
      <ForgotPassword />
    </LanguageProvider>
  );
}
