"use client"

import { LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logout } from "@/lib/actions/auth"
import { initials } from "@/lib/format"

export function UserMenu({
  user,
}: {
  user: { fullName: string; cedula: string; role: "ADMIN" | "ESTUDIANTE" }
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Menú de ${user.fullName}`}
        className="flex size-11 items-center justify-center rounded-full border bg-card text-sm font-semibold text-primary"
      >
        {initials(user.fullName)}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">{user.fullName}</span>
            <span className="tabular text-xs text-muted-foreground">
              {user.cedula} · {user.role === "ADMIN" ? "Administrador" : "Estudiante"}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => void logout()}>
          <LogOut aria-hidden="true" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
