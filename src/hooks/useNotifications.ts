// src/hooks/useNotifications.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import { get, patch } from "@/lib/http-client";

export const useNotifications = () =>
    useQuery({
        queryKey: ["notifications"],
        queryFn: () => get("/api/v1/notifications"),
    });

export const useMarkNotificationRead = (id: string) =>
    useMutation({
        mutationFn: () => patch(`/api/v1/notifications/${id}/read`),
    });
