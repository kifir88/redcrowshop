/**
 * Cart Overlays Hook
 * Управляет состоянием оверлеев для уведомлений о товарах
 */

"use client";

import { useState, useCallback } from "react";

interface UseCartOverlaysReturn {
  activeOverlays: number;
  registerOverlay: () => void;
  unregisterOverlay: () => void;
  hasActiveOverlays: boolean;
}

export function useCartOverlays(): UseCartOverlaysReturn {
  const [activeOverlays, setActiveOverlays] = useState<number>(0);

  const registerOverlay = useCallback(() => {
    setActiveOverlays((prev) => prev + 1);
  }, []);

  const unregisterOverlay = useCallback(() => {
    setActiveOverlays((prev) => Math.max(prev - 1, 0));
  }, []);

  return {
    activeOverlays,
    registerOverlay,
    unregisterOverlay,
    hasActiveOverlays: activeOverlays > 0,
  };
}

