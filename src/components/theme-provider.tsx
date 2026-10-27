"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

/** Modo claro/oscuro en `data-theme`; sigue al sistema hasta que el usuario elija. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="vi-theme"
    >
      {children}
    </NextThemesProvider>
  )
}
