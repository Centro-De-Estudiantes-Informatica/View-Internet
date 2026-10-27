import { redirect } from "next/navigation"

// `proxy.ts` envía a cada quien a su inicio; esto solo cubre el caso sin proxy.
export default function Home() {
  redirect("/login")
}
