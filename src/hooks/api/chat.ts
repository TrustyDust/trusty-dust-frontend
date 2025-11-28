import { useQuery, useMutation } from "@tanstack/react-query"
import { get, post } from "@/lib/http-client"
import { API_ROUTES } from "@/constant/api"

export const useConversationsApi = () =>
  useQuery({
    queryKey: ["chat-conversations"],
    queryFn: () => get(API_ROUTES.chat.conversations),
  })

export const useCreateConversationApi = () =>
  useMutation({
    mutationFn: (body: unknown) => post(API_ROUTES.chat.conversations, body),
  })

export const useMessagesApi = (conversationId: string) =>
  useQuery({
    queryKey: ["chat-messages", conversationId],
    queryFn: () => get(API_ROUTES.chat.conversationMessages(conversationId)),
    enabled: !!conversationId,
  })

export const useSendMessageApi = () =>
  useMutation({
    mutationFn: (body: unknown) => post(API_ROUTES.chat.sendMessage, body),
  })

