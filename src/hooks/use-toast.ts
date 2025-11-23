import { useCallback } from "react"
import { toast as sonnerToast } from "sonner"

export function useToast() {
  return {
    toast: sonnerToast,
    success: useCallback((message: string) => sonnerToast.success(message), []),
    error: useCallback((message: string) => sonnerToast.error(message), []),
    info: useCallback((message: string) => sonnerToast(message), []),
  }
}

export const toast = sonnerToast
