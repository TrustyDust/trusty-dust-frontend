// src/hooks/useChat.ts
import {
  useConversationsApi,
  useCreateConversationApi,
  useMessagesApi,
  useSendMessageApi,
} from "./api/chat"

export const useChatViewModel = (conversationId?: string) => {
  const conversations = useConversationsApi()
  const createConversation = useCreateConversationApi()
  const messages = useMessagesApi(conversationId ?? "")
  const sendMessage = useSendMessageApi()

  return { conversations, createConversation, messages, sendMessage }
}

export const useConversations = useConversationsApi
export const useCreateConversation = useCreateConversationApi
export const useMessages = useMessagesApi
export const useSendMessage = useSendMessageApi
