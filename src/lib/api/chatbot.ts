import { api } from './client'

export interface ChatbotMessageRequest {
  message: string
  conversationId?: string
}

export interface ChatbotMessageResponse {
  reply: string
  conversationId: string
  quickReplies?: string[]
}

export const chatbotApi = {
  sendMessage: (body: ChatbotMessageRequest) =>
    api.post<ChatbotMessageResponse>('/chatbot/message', {
      message: body.message,
      conversationId: body.conversationId ?? '',
    }),
}
