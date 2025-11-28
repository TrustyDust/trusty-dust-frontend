// src/hooks/useNotifications.ts
import { useNotificationsApi, useMarkNotificationReadApi } from "../api/notifications"

export const useNotificationsViewModel = () => {
  const notifications = useNotificationsApi()
  return { notifications }
}

export const useNotifications = useNotificationsApi
export const useMarkNotificationRead = useMarkNotificationReadApi
