import { useQuery, useMutation } from "@tanstack/react-query"
import { get, post } from "@/lib/http-client"
import { API_ROUTES } from "@/constant/api"
import type {
  ChatMessage,
  Conversation,
  CreateConversationRequest,
  CreateConversationResponse,
  SendMessageRequest,
} from "@/types/api"

type UseConversationsOptions = {
  enabled?: boolean
}

export const useConversationsApi = (options?: UseConversationsOptions) =>
  useQuery<Conversation[]>({
    queryKey: ["chat-conversations"],
    queryFn: () => get<Conversation[]>(API_ROUTES.chat.conversations),
    enabled: options?.enabled ?? true,
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  })

export const useCreateConversationApi = () =>
  useMutation<CreateConversationResponse, Error, CreateConversationRequest>({
    mutationFn: (body) => post<CreateConversationResponse>(API_ROUTES.chat.conversations, body),
  })

export const useMessagesApi = (conversationId: string) =>
  useQuery<ChatMessage[]>({
    queryKey: ["chat-messages", conversationId],
    queryFn: () => get<ChatMessage[]>(API_ROUTES.chat.conversationMessages(conversationId)),
    enabled: !!conversationId,
  })

export const useSendMessageApi = () =>
  useMutation<ChatMessage, Error, SendMessageRequest>({
    mutationFn: (body) => post<ChatMessage>(API_ROUTES.chat.sendMessage, body),
  })

