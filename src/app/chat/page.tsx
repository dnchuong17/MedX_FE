"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2, Send, MessageSquare } from "lucide-react"
import ChatHeader from "../../components/chat_ui/ChatHeader"
import ChatBubble from "../../components/chat_ui/ChatBubble"
import WelcomeMessage from "../../components/chat_ui/WelcomeMessage"
import BottomNavigation from "@/components/navbar"
import { AnimatePresence, motion } from "framer-motion"

interface Message {
  role: "user" | "bot"
  content: string
  timestamp?: number
}

const SYSTEM_MESSAGE = `You are MedX, a medical assistant chatbot designed to provide helpful, accurate, and safe medical information. Follow these guidelines:

1. Provide evidence-based medical information
2. Always emphasize that you're an AI assistant and not a replacement for professional medical advice
3. Be clear about limitations and uncertainties
4. Encourage users to consult healthcare professionals for specific medical concerns
5. Maintain a professional, empathetic, and supportive tone
6. Focus on general health information and education
7. Avoid making definitive diagnoses or treatment recommendations
8. Prioritize user safety and well-being in all responses

Remember: Your primary goal is to provide helpful medical information while ensuring users understand the importance of professional medical consultation.`

function groupMessages(messages: Message[]) {
  if (messages.length === 0) return []
  const groups: { role: Message["role"]; messages: Message[] }[] = []
  let currentGroup = { role: messages[0].role, messages: [messages[0]] }
  for (let i = 1; i < messages.length; i++) {
    if (messages[i].role === currentGroup.role) {
      currentGroup.messages.push(messages[i])
    } else {
      groups.push(currentGroup)
      currentGroup = { role: messages[i].role, messages: [messages[i]] }
    }
  }
  groups.push(currentGroup)
  return groups
}

const ChatContainer = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isBotTyping, setIsBotTyping] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollHeight = scrollAreaRef.current.scrollHeight
      scrollAreaRef.current.scrollTo({
        top: scrollHeight,
        behavior: "smooth",
      })
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isBotTyping, scrollToBottom])

  function handleScroll() {
    if (!scrollAreaRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current
    setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10)
  }

  async function handleSend() {
    if (!input.trim()) return
    setIsBotTyping(true)
    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, userMessage])
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: input,
          systemMessage: SYSTEM_MESSAGE,
        }),
      })
      const data = await res.json()
      const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "No response"
      const botMessage: Message = {
        role: "bot",
        content: reply,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, botMessage])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "Failed to fetch response.",
          timestamp: Date.now(),
        },
      ])
    } finally {
      setIsBotTyping(false)
      setInput("")
      inputRef.current?.focus()
    }
  }

  function handleClear() {
    setMessages([])
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Group messages for better UX
  const grouped = groupMessages(messages)

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-gradient-to-b from-purple-50 to-transparent">
        <ChatHeader />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative">
        <ScrollArea
          className="h-full px-3 py-4"
          ref={scrollAreaRef}
          onScroll={handleScroll}
        >
          {messages.length === 0 ? (
            <WelcomeMessage />
          ) : (
            <div className="space-y-6 pb-6">
              <AnimatePresence>
                {grouped.map((group, groupIdx) => (
                  <div
                    key={groupIdx}
                    className="space-y-2"
                  >
                    {group.messages.map((msg, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChatBubble
                          message={{
                            role: msg.role,
                            content: msg.content,
                            timestamp:
                              msg.timestamp?.toString() ||
                              new Date().toISOString(),
                          }}
                          isLastMessage={
                            groupIdx === grouped.length - 1 &&
                            idx === group.messages.length - 1
                          }
                        />
                        {/* Timestamp below each message */}
                        <div
                          className={`text-xs text-gray-400 mt-1 ${
                            msg.role === "user" ? "text-right mr-12" : "ml-12"
                          }`}
                        >
                          {msg.timestamp &&
                            new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ))}
                {isBotTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-2 animate-pulse mt-2"
                    aria-live="polite"
                  >
                    <div className="h-8 w-8 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[85%]">
                      <span className="sr-only">Bot is typing</span>
                      <div className="flex gap-1">
                        <div className="h-2 w-2 rounded-full bg-purple-300 animate-bounce [animation-delay:-0.3s]" />
                        <div className="h-2 w-2 rounded-full bg-purple-400 animate-bounce [animation-delay:-0.15s]" />
                        <div className="h-2 w-2 rounded-full bg-purple-500 animate-bounce" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>
        {/* Scroll to latest button */}
        {!isAtBottom && (
          <button
            className="absolute right-4 bottom-32 bg-purple-500 text-white rounded-full px-3 py-1 shadow-lg z-30"
            onClick={scrollToBottom}
            aria-label="Scroll to latest"
          >
            ↓ New messages
          </button>
        )}
      </div>

      {/* Sticky Input Area */}
      <div className="sticky bottom-0 z-20 bg-white bg-opacity-90 backdrop-blur-sm border-t border-gray-200">
        <div className="px-3 py-3">
          <div className="flex items-end gap-2 max-w-lg mx-auto">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              onKeyDown={handleInputKeyDown}
              disabled={isBotTyping}
              className="flex-1 rounded-lg px-4 py-2 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 shadow-md resize-none min-h-[44px] max-h-32 text-sm border-2 border-gray-300"
              rows={1}
              aria-label="Message input"
              tabIndex={0}
            />
            <Button
              onClick={handleSend}
              size="icon"
              disabled={isBotTyping || !input.trim()}
              className="shrink-0 rounded-full h-10 w-10 bg-purple-500 hover:bg-purple-600 shadow-xl"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleClear}
              variant="ghost"
              size="icon"
              className="shrink-0 rounded-lg border-2 border-gray-500 h-10 w-10 hover:bg-gray-100 shadow-xl"
              aria-label="Clear chat"
            >
              <Trash2 className="h-4 w-4 text-gray-500" />
            </Button>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500 text-center w-full">
              MedX provides general information only, not a doctor.
            </p>
            <span className="hidden md:inline text-xs text-gray-400 ml-4">
              Press <kbd className="px-1 py-0.5 bg-gray-100 rounded">Enter</kbd>{" "}
              to send,{" "}
              <kbd className="px-1 py-0.5 bg-gray-100 rounded">Shift+Enter</kbd>{" "}
              for newline
            </span>
          </div>
        </div>
        <div className="mt-18">
          <BottomNavigation />
        </div>
      </div>
    </div>
  )
}

export default ChatContainer
