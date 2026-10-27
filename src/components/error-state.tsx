"use client"

import { RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"

/** Contenido de los `error.tsx`. En producción el mensaje real no llega al cliente. */
export function ErrorState({ retry }: { retry: () => void }) {
  return (
    <div
      role="alert"
      className="mx-auto my-8 flex max-w-md flex-col items-center gap-4 rounded-2xl border bg-card p-8 text-center"
    >
      <h1 className="text-xl font-semibold">No se pudo cargar esta página</h1>
      <p className="text-sm text-muted-foreground">
        Puede ser un problema de conexión con el servidor. Intenta de nuevo en un momento.
      </p>
      <Button onClick={() => retry()} className="h-11">
        <RotateCw aria-hidden="true" />
        Reintentar
      </Button>
    </div>
  )
}
