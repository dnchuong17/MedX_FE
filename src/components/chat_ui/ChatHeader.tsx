import { MessageSquare } from "lucide-react"

const ChatHeader = () => {
  return (
    <header className="w-full px-4 py-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-lg mx-auto flex items-center gap-3">
        <div className="h-10 w-10 border border-purple-100 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
          <MessageSquare className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">MedX Chat</h1>
          <p className="text-sm text-gray-500">Your medical assistant</p>
        </div>
      </div>
    </header>
  )
}

export default ChatHeader
