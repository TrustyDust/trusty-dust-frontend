import { useQuery, useMutation } from "@tanstack/react-query"
import { get, patch } from "@/lib/http-client"
import { API_ROUTES } from "@/constant/api"

export const useNotificationsApi = () =>
  useQuery({
    queryKey: ["notifications"],
    queryFn: () => get(API_ROUTES.notifications.list),
  })

export const useMarkNotificationReadApi = (id: string) =>
  useMutation({
    mutationFn: () => patch(API_ROUTES.notifications.markAsRead(id)),
  })

