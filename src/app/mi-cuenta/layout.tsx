import Link from "next/link"
import { Suspense } from "react"
import { Brand } from "@/components/brand"
import { SessionUserMenu } from "@/components/session-user"
import { ThemeToggle } from "@/components/theme-toggle"

export default function StudentLayout({ children }: LayoutProps<"/mi-cuenta">) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3 px-4 pt-5 pb-2">
        <Link href="/mi-cuenta" className="rounded-lg">
          <Brand compact />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Suspense fallback={<span className="size-11 rounded-full border bg-card" />}>
            <SessionUserMenu />
          </Suspense>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pt-3 pb-10">
        {children}
      </main>
    </div>
  )
}
