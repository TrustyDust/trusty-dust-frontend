import { useQuery, useMutation } from "@tanstack/react-query"
import { get, patch } from "@/lib/http-client"
import { API_ROUTES } from "@/constant/api"
import type { NotificationItem, NotificationListResponse } from "@/types/api"

export const useNotificationsApi = () =>
  useQuery<NotificationListResponse>({
    queryKey: ["notifications"],
    queryFn: () => get<NotificationListResponse>(API_ROUTES.notifications.list),
  })

export const useMarkNotificationReadApi = (id: string) =>
  useMutation<NotificationItem>({
    mutationFn: () => patch<NotificationItem>(API_ROUTES.notifications.markAsRead(id)),
  })

