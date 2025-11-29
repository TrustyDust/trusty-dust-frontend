"use client"

import { LoadDialog } from "@/components/Load"
import { createContext, useContext, useMemo, useState, PropsWithChildren, useCallback } from "react"

type LoadingContextValue = {
  isOpen: boolean
  show: () => void
  hide: () => void
}

const LoadingContext = createContext<LoadingContextValue | null>(null)

export function LoadingProvider({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false)

  const show = useCallback(() => setIsOpen(true), [])
  const hide = useCallback(() => setIsOpen(false), [])

  const value = useMemo(
    () => ({
      isOpen,
      show,
      hide,
    }),
    [isOpen, show, hide],
  )

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <LoadDialog isOpen={isOpen} />
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const ctx = useContext(LoadingContext)
  if (!ctx) {
    throw new Error("useLoading must be used within LoadingProvider")
  }
  return ctx
}
