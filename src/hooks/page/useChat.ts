// src/hooks/useChat.ts
import {
  useConversationsApi,
  useCreateConversationApi,
  useMessagesApi,
  useSendMessageApi,
} from "../api/chat"

export const useChatViewModel = () => {
  const conversations = useConversationsApi()
  const createConversation = useCreateConversationApi()
  const sendMessage = useSendMessageApi()

  return { conversations, createConversation, sendMessage }
}

export const useConversations = useConversationsApi
export const useCreateConversation = useCreateConversationApi
export const useMessages = useMessagesApi
export const useSendMessage = useSendMessageApi
