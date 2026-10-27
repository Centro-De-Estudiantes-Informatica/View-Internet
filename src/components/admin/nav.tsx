"use client"

import { CircleCheckBig, CreditCard, LayoutDashboard, Settings, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const ITEMS = [
  { href: "/admin", label: "Panel", icon: LayoutDashboard },
  { href: "/admin/personas", label: "Personas", icon: Users },
  { href: "/admin/pagos", label: "Pagos", icon: CreditCard },
  {
    href: "/admin/pagos?estado=EN_REVISION",
    label: "Por revisar",
    icon: CircleCheckBig,
    desktopOnly: true,
  },
  { href: "/admin/ajustes", label: "Cuota y tasas", short: "Ajustes", icon: Settings },
] as const

type NavProps = { reviewBadge?: React.ReactNode; pathname?: string }

function activeChecker(pathname: string | undefined) {
  return (href: string) => {
    // "Por revisar" es un filtro de Pagos: no se marca aparte.
    if (!pathname || href.includes("?")) return false
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }
}

/**
 * Menú lateral (≥ 1024 px). `reviewBadge` muestra cuántos pagos móviles esperan revisión.
 * Sin `pathname` no marca ningún ítem: sirve de fallback estático mientras llega la ruta.
 */
export function SideNavList({ reviewBadge, pathname }: NavProps) {
  const isActive = activeChecker(pathname)
  return (
    <nav aria-label="Principal" className="flex flex-col gap-1">
      {ITEMS.map((item) => {
        const active = isActive(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-11 items-center gap-3 rounded-[10px] px-3 text-[15px] transition-colors",
              active
                ? "bg-accent font-medium text-accent-foreground"
                : "text-foreground/80 hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="size-[18px]" aria-hidden="true" />
            <span className="flex-1">{item.label}</span>
            {item.label === "Por revisar" && reviewBadge}
          </Link>
        )
      })}
    </nav>
  )
}

/** Barra inferior para teléfonos y tablets. */
export function BottomNavList({ reviewBadge, pathname }: NavProps) {
  const isActive = activeChecker(pathname)
  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-sidebar/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-4">
        {ITEMS.filter((item) => !("desktopOnly" in item)).map((item) => {
          const active = isActive(item.href)
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-16 flex-col items-center justify-center gap-1 text-xs",
                  active ? "font-medium text-primary" : "text-muted-foreground",
                )}
              >
                <item.icon className="size-5" aria-hidden="true" />
                {"short" in item ? item.short : item.label}
                {item.href === "/admin/pagos" && (
                  <span className="absolute top-2 left-[calc(50%+6px)]">{reviewBadge}</span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export function SideNav({ reviewBadge }: NavProps) {
  return <SideNavList reviewBadge={reviewBadge} pathname={usePathname()} />
}

export function BottomNav({ reviewBadge }: NavProps) {
  return <BottomNavList reviewBadge={reviewBadge} pathname={usePathname()} />
}
