"use client";

import { useEffect, useRef } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";

/**
 * Envoie un PAGE_VIEW une seule fois au chargement de la page (côté client).
 */
export default function TrackPageView() {
  const { trackEvent } = useAnalytics();
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    trackEvent("PAGE_VIEW");
  }, [trackEvent]);

  return null;
}
