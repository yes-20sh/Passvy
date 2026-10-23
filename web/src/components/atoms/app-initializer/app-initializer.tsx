"use client";

import { useAuthInit } from "@/hooks/useAuthInit";

export function AppInitializer() {
  useAuthInit();
  return null;
}
