import { Search } from "lucide-react"
import Form from "next/form"
import Link from "next/link"
import { Suspense } from "react"
import { BottomNav, BottomNavList, SideNav, SideNavList } from "@/components/admin/nav"
import { ReviewCountBadge } from "@/components/admin/review-count"
import { Brand } from "@/components/brand"
import { SessionUserMenu } from "@/components/session-user"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  const badge = (
    <Suspense fallback={null}>
      <ReviewCountBadge />
    </Suspense>
  )
  return (
    <div className="flex min-h-dvh flex-1">
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col gap-7 border-r bg-sidebar px-5 py-7 lg:flex">
        <Link href="/admin" className="rounded-lg">
          <Brand compact />
        </Link>
        <Suspense fallback={<SideNavList />}>
          <SideNav reviewBadge={badge} />
        </Suspense>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col pb-20 lg:pb-0">
        <header className="flex flex-wrap items-center gap-3 px-4 pt-4 sm:px-6 lg:px-8 lg:pt-6">
          <Link href="/admin" className="rounded-lg lg:hidden">
            <Brand compact />
          </Link>
          <Form
            action="/admin/personas"
            role="search"
            className="order-last w-full sm:order-none sm:ml-auto sm:w-auto"
          >
            <label htmlFor="global-search" className="sr-only">
              Buscar persona por cédula o nombre
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="global-search"
                name="q"
                type="search"
                placeholder="Buscar por cédula o nombre"
                className="h-11 w-full rounded-[10px] border-field-border bg-card pl-10 text-sm sm:w-72"
              />
            </div>
          </Form>
          <div className="ml-auto flex items-center gap-2 sm:ml-0">
            <ThemeToggle />
            <Suspense fallback={<span className="size-11 rounded-full border bg-card" />}>
              <SessionUserMenu />
            </Suspense>
          </div>
        </header>
        <main className="flex min-w-0 flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>

      <Suspense fallback={<BottomNavList />}>
        <BottomNav reviewBadge={badge} />
      </Suspense>
    </div>
  )
}
