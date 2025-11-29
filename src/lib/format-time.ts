import { formatDistanceToNow } from "date-fns"

/**
 * Format timestamp menjadi relative time (e.g., "2 minutes ago")
 * @param timestamp - ISO timestamp string atau Date
 * @returns Formatted relative time string
 */
export function formatTimeAgo(timestamp: string | Date): string {
  try {
    const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp
    return formatDistanceToNow(date, { addSuffix: true })
  } catch (error) {
    console.warn("Invalid timestamp:", timestamp, error)
    return "some time ago"
  }
}

