"use client"

import { Search, X } from "lucide-react"
import { useEffect, useState, useTransition } from "react"
import { EstadoBadge } from "@/components/status-badge"
import { Input } from "@/components/ui/input"
import { type StudentOption, searchStudents } from "@/lib/actions/users"
import type { PeriodStatus } from "@/lib/api/types"
import { initials } from "@/lib/format"

/** Buscador de estudiante por cédula o nombre. Envía `userId` en un campo oculto. */
export function StudentPicker({ initial, error }: { initial?: StudentOption; error?: string }) {
  const [selected, setSelected] = useState<StudentOption | undefined>(initial)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<StudentOption[]>([])
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    if (selected || query.trim().length < 2) return
    const timer = setTimeout(() => {
      startTransition(async () => setResults(await searchStudents(query)))
    }, 250)
    return () => clearTimeout(timer)
  }, [query, selected])

  if (selected) {
    return (
      <div className="flex min-h-13 items-center gap-3 rounded-[10px] border border-primary bg-field px-3.5 py-2">
        <input type="hidden" name="userId" value={selected.id} />
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-[13px] font-semibold text-accent-foreground">
          {initials(selected.fullName)}
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span id="student" className="truncate text-[15px] text-foreground">
            {selected.fullName}
          </span>
          <span className="tabular text-xs text-muted-foreground">{selected.cedula}</span>
        </span>
        {selected.status && (
          <EstadoBadge status={selected.status as PeriodStatus} showIcon={false} />
        )}
        <button
          type="button"
          onClick={() => {
            setSelected(undefined)
            setQuery("")
            setResults([])
          }}
          aria-label="Cambiar estudiante"
          className="flex size-11 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    )
  }

  const showResults = query.trim().length >= 2
  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          id="student"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (e.target.value.trim().length < 2) setResults([])
          }}
          placeholder="Cédula o nombre del estudiante"
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "userId-error" : "student-results"}
          className="h-12 rounded-[10px] border-field-border bg-field pl-10 text-[15px] md:text-[15px]"
        />
      </div>
      {error && (
        <p id="userId-error" role="alert" className="text-[13px] font-medium text-due">
          {error}
        </p>
      )}
      <div id="student-results" aria-live="polite">
        {showResults && !pending && results.length === 0 && (
          <p className="px-1 text-sm text-muted-foreground">Nadie coincide con “{query.trim()}”.</p>
        )}
        {results.length > 0 && (
          <ul
            className="flex flex-col overflow-hidden rounded-[10px] border bg-popover"
            aria-label="Resultados"
          >
            {results.map((s) => (
              <li key={s.id} className="border-b last:border-b-0">
                <button
                  type="button"
                  onClick={() => setSelected(s)}
                  className="flex min-h-12 w-full items-center gap-3 px-3.5 py-2 text-left hover:bg-muted"
                >
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-[15px] text-foreground">{s.fullName}</span>
                    <span className="tabular text-xs text-muted-foreground">{s.cedula}</span>
                  </span>
                  {s.status && <EstadoBadge status={s.status as PeriodStatus} showIcon={false} />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
