"use client"

import { ErrorState } from "@/components/error-state"

export default function ErrorPage({ retry }: { error: unknown; retry: () => void }) {
  return <ErrorState retry={retry} />
}
