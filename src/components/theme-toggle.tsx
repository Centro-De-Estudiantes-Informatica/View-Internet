"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

// El servidor no conoce el tema: la etiqueta es fija y los íconos cambian por CSS.
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={className ?? "size-11"}
      aria-label="Cambiar entre modo claro y oscuro"
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
    >
      <Sun className="hidden size-5 dark:block" aria-hidden="true" />
      <Moon className="size-5 dark:hidden" aria-hidden="true" />
    </Button>
  )
}
