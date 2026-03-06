"use client";

import { useLanguage } from "@/app/context/LanguageContext";

const TRACK_ENDPOINT = "/api/track";
const MOBILE_MEDIA_QUERY = "(max-width: 768px)";

export interface TrackMetadata {
  duration_seconds?: number;
  project?: string;
  category?: string;
  [key: string]: unknown;
}

export interface TrackClickOptions {
  desktopSuffix?: string;
  mobileSuffix?: string;
}

export function useAnalytics() {
  const { language } = useLanguage();

  const trackEvent = async (
    type: "PAGE_VIEW" | "CLICK" | "SECTION_VIEW" | "DURATION",
    label?: string,
    metadata: TrackMetadata = {}
  ) => {
    if (typeof window === "undefined") return;
    const data = {
      type,
      path: window.location.pathname,
      label,
      metadata,
      timestamp: new Date(),
    };
    try {
      await fetch(TRACK_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error("Tracking error:", err);
    }
  };

  /**
   * Envoie un événement CLICK avec le label suffixé selon mobile/desktop et langue.
   * Format final : label + (desktopSuffix | mobileSuffix) + _LANG_FR | _LANG_EN
   */
  const trackClick = (
    label: string,
    extraData: TrackMetadata = {},
    options: TrackClickOptions = {}
  ) => {
    const { desktopSuffix = "", mobileSuffix = "_mobile" } = options;
    const isMobile =
      typeof window !== "undefined" && window.matchMedia(MOBILE_MEDIA_QUERY).matches;
    const langSuffix = language === "fr" ? "_LANG_FR" : "_LANG_EN";
    const finalLabel = `${isMobile ? `${label}${mobileSuffix}` : `${label}${desktopSuffix}`}${langSuffix}`;
    trackEvent("CLICK", finalLabel, extraData);
  };

  return { trackClick, trackEvent };
}
