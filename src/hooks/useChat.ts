// src/hooks/useChat.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import { get, post } from "@/lib/http-client";

export const useConversations = () =>
    useQuery({
        queryKey: ["chat-conversations"],
        queryFn: () => get("/api/v1/chat/conversations"),
    });

export const useCreateConversation = () =>
    useMutation({
        mutationFn: (body: any) => post("/api/v1/chat/conversations", body),
    });

export const useMessages = (conversationId: string) =>
    useQuery({
        queryKey: ["chat-messages", conversationId],
        queryFn: () => get(`/api/v1/chat/conversations/${conversationId}/messages`),
        enabled: !!conversationId,
    });

export const useSendMessage = () =>
    useMutation({
        mutationFn: (body: any) => post("/api/v1/chat/messages", body),
    });
