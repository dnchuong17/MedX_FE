import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { FaUserCircle } from "react-icons/fa"
import { RiRobot2Line } from "react-icons/ri"
import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import { Components } from "react-markdown"

interface ChatBubbleProps {
  message: {
    role: "user" | "bot"
    content: string
    timestamp: string // ISO string or number
  }
  isLastMessage?: boolean
}

const formatMessage = (content: string) => {
  let formatted = content.replace(/\n{3,}/g, "\n\n")
  formatted = formatted.replace(/\\n/g, "\n")
  formatted = formatted.trim()
  return formatted
}

const markdownComponents: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  strong: ({ children }) => (
    <strong className="font-semibold text-purple-600">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-gray-600">{children}</em>,
  ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
  li: ({ children }) => <li className="mb-1">{children}</li>,
  code: ({ children }) => (
    <code className="bg-gray-100 rounded px-1 py-0.5">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="bg-gray-100 rounded p-2 mb-2 overflow-x-auto">
      {children}
    </pre>
  ),
}

function format24HourTime(timestamp: string | number): string {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")
  return `${hours}:${minutes}`
}

const ChatBubble = ({ message, isLastMessage = false }: ChatBubbleProps) => {
  const isUser = message.role === "user"
  const [displayedContent, setDisplayedContent] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (!isUser && isLastMessage) {
      setIsTyping(true)
      let currentIndex = 0
      const content = formatMessage(message.content)

      const typingInterval = setInterval(() => {
        if (currentIndex <= content.length) {
          setDisplayedContent(content.slice(0, currentIndex))
          currentIndex++
        } else {
          clearInterval(typingInterval)
          setIsTyping(false)
        }
      }, 20)

      return () => clearInterval(typingInterval)
    } else {
      setDisplayedContent(formatMessage(message.content))
    }
  }, [message.content, isUser, isLastMessage])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-2 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className={`h-8 w-8 flex items-center justify-center rounded-full ${
          isUser ? "text-purple-500" : "text-purple-600"
        }`}
      >
        {isUser ? (
          <FaUserCircle className="h-8 w-8" />
        ) : (
          <RiRobot2Line className="h-8 w-8" />
        )}
      </motion.div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-[85%]"
      >
        <Card
          className={`p-3 text-sm relative group ${
            isUser
              ? "bg-gradient-to-r from-purple-300 via-purple-400 to-purple-500 text-white rounded-lg shadow-md"
              : "bg-white text-gray-800 rounded-2xl shadow-md shadow-gray-300 border-2 border-gray-300 transition-shadow"
          }`}
        >
          <div className="relative prose prose-sm max-w-none dark:prose-invert">
            {isUser ? (
              displayedContent
            ) : (
              <ReactMarkdown components={markdownComponents}>
                {displayedContent}
              </ReactMarkdown>
            )}
            {isTyping && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-1 h-4 ml-1 bg-current align-middle"
              />
            )}
          </div>
        </Card>

        {isUser && isLastMessage && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[10px] text-gray-500 mt-1 text-right mr-1"
          >
            {format24HourTime(message.timestamp)}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  )
}

export default ChatBubble
