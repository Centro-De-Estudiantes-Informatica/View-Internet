import { UserMenu } from "@/components/user-menu"
import { getSessionUser } from "@/lib/session"

/** Lee la sesión: usar siempre dentro de un `<Suspense>`. */
export async function SessionUserMenu() {
  const user = await getSessionUser()
  return user ? <UserMenu user={user} /> : null
}
