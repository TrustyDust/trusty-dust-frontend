import { useMutation, useQuery } from "@tanstack/react-query"

import { API_ROUTES } from "@/constant/api"
import { get, patch } from "@/lib/http-client"
import type { NotificationItem, NotificationListResponse } from "@/types/api"

type UseNotificationsOptions = {
  enabled?: boolean
}

export const useNotificationsApi = (options?: UseNotificationsOptions) =>
  useQuery<NotificationListResponse>({
    queryKey: ["notifications"],
    queryFn: () => get<NotificationListResponse>(API_ROUTES.notifications.list),
    enabled: options?.enabled ?? true,
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  })

export const useMarkNotificationReadApi = () =>
  useMutation<NotificationItem, Error, string>({
    mutationFn: (id) => patch<NotificationItem>(API_ROUTES.notifications.markAsRead(id)),
  })

