"use client";

import { useEffect, useRef } from "react";
import { useAnalytics } from "./useAnalytics";

/**
 * Hook pour tracer l'arrivée dans une section une seule fois,
 * avec un label différent selon mobile/desktop.
 */
export function useTrackSectionArrival(
  sectionName: string,
  desktopSuffix: string = "",
  mobileSuffix: string = "_mobile"
) {
  const { trackClick } = useAnalytics();
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;
    if (typeof window === "undefined") return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const label = isMobile
      ? `${sectionName}${mobileSuffix}`
      : `${sectionName}${desktopSuffix}`;
    trackClick(label);
    hasTracked.current = true;
  }, [sectionName, desktopSuffix, mobileSuffix, trackClick]);
}
