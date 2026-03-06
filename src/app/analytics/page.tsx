"use client";

import { useEffect } from "react";
import { useSession, SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import AnalyticsDashboard from "@/components/Analytics/Analytics";

function AnalyticsContent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace("/login");
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Chargement...
      </div>
    );
  }
  if (!session) {
    return null;
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <AnalyticsDashboard />
    </main>
  );
}

export default function AnalyticsPage() {
  return (
    <SessionProvider>
      <AnalyticsContent />
    </SessionProvider>
  );
}
