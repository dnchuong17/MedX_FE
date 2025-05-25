import { motion } from "framer-motion"
import { MessageSquare, Activity, Heart, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"

const WelcomeMessage = () => {
  return (
    <div className="flex flex-col items-center px-4 py-8 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mb-4"
      >
        <MessageSquare className="h-8 w-8 text-purple-600" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-xl font-semibold text-gray-800 mb-2"
      >
        Welcome to MedX Assistant
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-gray-500 mb-6 max-w-xs"
      >
        Ask me questions about general health topics, symptoms, or wellness
        advice.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid gap-3 w-full max-w-xs"
      >
        <SuggestionCard
          icon={Heart}
          title="Healthy habits"
          description="Ask me about exercise, nutrition, and sleep"
          delay={0.4}
        />

        <SuggestionCard
          icon={Activity}
          title="Symptom information"
          description="Learn about common symptoms and when to see a doctor"
          delay={0.5}
        />

        <SuggestionCard
          icon={AlertCircle}
          title="Medical disclaimer"
          description="I provide information only, not medical advice"
          delay={0.6}
        />
      </motion.div>
    </div>
  )
}

interface SuggestionCardProps {
  icon: React.ElementType
  title: string
  description: string
  delay: number
}

const SuggestionCard = ({
  icon: Icon,
  title,
  description,
  delay,
}: SuggestionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="p-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center">
            <Icon className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-left">
            <h3 className="font-medium text-sm text-gray-800">{title}</h3>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default WelcomeMessage
