export function getErrorMessage(error: unknown, fallback = "Something went wrong. Please try again.") {
  if (error instanceof Error) {
    return error.message || fallback
  }
  if (typeof error === "string" && error.trim().length > 0) {
    return error
  }
  if (error && typeof error === "object" && "message" in error) {
    const message = String((error as { message?: unknown }).message)
    if (message.trim().length > 0) {
      return message
    }
  }
  return fallback
}

