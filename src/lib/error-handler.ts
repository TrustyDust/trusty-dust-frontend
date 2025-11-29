/**
 * Global error handler untuk suppress error dari wallet extensions
 * Error chrome.runtime.sendMessage() biasanya muncul dari wallet provider
 * yang mencoba berkomunikasi dengan Chrome Extension API
 */

export function setupErrorHandler() {
  if (globalThis.window === undefined) return

  // Handle unhandled promise rejections
  globalThis.window.addEventListener("unhandledrejection", (event) => {
    const error = event.reason
    const errorMessage = typeof error === "string" ? error : String(error?.message || error)

    // Suppress chrome.runtime.sendMessage errors dari wallet extensions
    if (
      errorMessage.includes("chrome.runtime.sendMessage") ||
      errorMessage.includes("Extension ID") ||
      (typeof error === "object" &&
        error !== null &&
        "message" in error &&
        String(error.message).includes("chrome.runtime.sendMessage"))
    ) {
      event.preventDefault()
      // Silent suppress - error ini tidak berbahaya dan berasal dari wallet extension
      return
    }

    // Log other errors for debugging
    if (process.env.NODE_ENV === "development") {
      console.warn("Unhandled promise rejection:", error)
    }
  })

  // Handle runtime errors
  globalThis.window.addEventListener("error", (event) => {
    const errorMessage = event.message || String(event.error?.message || "")

    // Suppress chrome.runtime.sendMessage errors
    if (errorMessage.includes("chrome.runtime.sendMessage") || errorMessage.includes("Extension ID")) {
      event.preventDefault()
    }
  })
}

