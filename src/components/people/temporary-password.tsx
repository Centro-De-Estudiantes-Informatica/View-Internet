"use client"

import { Check, Copy } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

/** Contraseña temporal: se muestra una sola vez, con botón para copiarla. */
export function TemporaryPassword({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-primary/40 bg-accent p-4">
      <span className="text-[13px] text-muted-foreground">
        Contraseña temporal (no se volverá a mostrar)
      </span>
      <div className="flex items-center justify-between gap-3">
        <code className="tabular text-xl font-medium tracking-wider text-foreground select-all">
          {value}
        </code>
        <Button
          type="button"
          variant="outline"
          className="h-11"
          onClick={async () => {
            await navigator.clipboard.writeText(value)
            setCopied(true)
          }}
        >
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          {copied ? "Copiada" : "Copiar"}
        </Button>
      </div>
      <span className="text-[13px] text-muted-foreground">
        Entrégasela a la persona: deberá cambiarla en su primer ingreso.
      </span>
    </div>
  )
}
