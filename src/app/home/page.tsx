"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/store/store"
import {
  cleanupExpired,
  selectCompletedChallengeIds,
} from "@/store/slices/challengesSlice"

import {
  Bell,
  Settings,
  Clock,
  LogOut,
  User,
  MessageCircle,
  File,
  Search,
  Sparkles, Users,
} from "lucide-react"
import { FaUserCircle } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

import BottomNavigation from "@/components/navbar"
import {
  setAuthToken,
  apiClient,
  getAllChallenges,
  getAllHealthNews,
} from "@/utils/api"
import { BarLoader } from "react-spinners"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image"
import Markdown from "markdown-to-jsx"

interface HealthMetric {
  title: string
  value: string | number
  description: string
}

interface Challenge {
  id: number
  description: string
  conditionKey: string
  conditionValue: number
  unit: string
  timeFrame: string
  rewardAmount: number
  conditionKeywords: string[] | null
}

interface UserData {
  name: string
  email: string
}

interface HealthNews {
  id: number
  title: string
  content: string
  author: string
  publishedAt: string
  imageUrl?: string
}

function getShortDescription(content: string) {
  if (!content) return ""
  // Use first sentence or first 100 chars
  const firstSentence = content.split(". ")[0]
  return firstSentence.length > 100
    ? content.slice(0, 100) + "..."
    : firstSentence + "."
}

const HomePage = () => {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [isChallengesLoading, setIsChallengesLoading] = useState(true)
  const [challengesError, setChallengesError] = useState<string | null>(null)
  const dispatch = useDispatch()
  const completedChallengeIds = useSelector((state: RootState) =>
    selectCompletedChallengeIds(state.challenges)
  )
  const [search, setSearch] = useState("")
  const [visibleCount, setVisibleCount] = useState(3)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [news, setNews] = useState<HealthNews[]>([])
  const [isNewsLoading, setIsNewsLoading] = useState(true)
  const [newsError, setNewsError] = useState<string | null>(null)
  const [selectedNews, setSelectedNews] = useState<HealthNews | null>(null)
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [aiSummary, setAiSummary] = useState<string | null>(null)
  const [showOriginal, setShowOriginal] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        if (!token) throw new Error("No token found")

        setAuthToken(token)
        const response = await apiClient.get<UserData>("/user/me")
        setUser(response.data)
      } catch (error) {
        console.error("Error fetching user:", error)
        localStorage.removeItem("accessToken")
        setAuthToken(null)
        router.push("/auth/login")
      }
    }

    fetchUser()
  }, [router])

  useEffect(() => {
    async function fetchChallenges() {
      setIsChallengesLoading(true)
      setChallengesError(null)
      try {
        const data = await getAllChallenges()
        setChallenges(data)
      } catch {
        setChallengesError("Failed to load challenges")
      } finally {
        setIsChallengesLoading(false)
      }
    }
    fetchChallenges()
  }, [])

  useEffect(() => {
    dispatch(cleanupExpired())
  }, [dispatch])

  useEffect(() => {
    async function fetchNews() {
      setIsNewsLoading(true)
      setNewsError(null)
      try {
        const data = await getAllHealthNews()
        setNews(data)
      } catch {
        setNewsError("Failed to load health news")
      } finally {
        setIsNewsLoading(false)
      }
    }
    fetchNews()
  }, [])

  useEffect(() => {
    if (!selectedNews) {
      setShowOriginal(false)
      setAiSummary(null)
      setIsSummarizing(false)
    }
  }, [selectedNews])

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    setAuthToken(null)
    router.push("/auth/login")
  }

  const healthMetrics: HealthMetric[] = [
    { title: "BMI Index", value: "23.5", description: "Normal" },
    { title: "Heart Rate", value: "72", description: "Average BPM today" },
    {
      title: "Activity Streak",
      value: "7",
      description: "Consecutive active days",
    },
    { title: "Weight Loss", value: "3.2/5", description: "KG lost/goal" },
  ]

  const filteredChallenges = challenges.filter((challenge: Challenge) => {
    if (!search) return true
    return challenge.description.toLowerCase().includes(search.toLowerCase())
  })

  const handleLoadMore = () => {
    setIsLoadingMore(true)
    setTimeout(() => {
      setVisibleCount((c) => c + 3)
      setIsLoadingMore(false)
    }, 500)
  }

  async function handleSummarize() {
    if (!selectedNews) return
    setIsSummarizing(true)
    setAiSummary(null)
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Summarize the following health news in concise, clear, and friendly language. Use bullet points or short paragraphs. Give for me a short summary of the news about 100 words with easy to read and understand. Give for me just summarized content with no other text. Do not add any other text or comments. Summarized content with format and emoji. \n\n${selectedNews.content}`,
          systemMessage: "You are a helpful medical news summarizer.",
        }),
      })
      const data = await res.json()
      const summary =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No summary available."
      setAiSummary(summary)
    } catch {
      setAiSummary("Failed to summarize. Please try again.")
    } finally {
      setIsSummarizing(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen bg-white"
    >
      {/* Header */}
      <header className="sticky top-0 z-30 p-4 flex items-center justify-between bg-white bg-opacity-95 backdrop-blur shadow-xl mb-8">
        <div className="flex items-center space-x-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center"
          >
            <FaUserCircle className="w-8 h-8 text-gray-400" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <p className="text-sm text-gray-500">Hi, Welcome Back</p>
            <p className="text-sm font-semibold text-blue-600">
              {user?.name || "Loading..."}
            </p>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="flex items-center space-x-4"
        >
          <button
            onClick={() => setSearch((s) => (s ? "" : s))}
            className="focus:outline-none"
            title="Search Challenges"
          >
            <Search className="h-6 w-6 text-gray-500" />
          </button>
          <Bell className="h-6 w-6 text-gray-500" />
          <Settings className="h-6 w-6 text-gray-500" />
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            title="Logout"
          >
            <LogOut className="h-6 w-6 text-gray-500 hover:text-red-500 transition-colors" />
          </button>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-20">
        {/* Health Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          {healthMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
              }}
              className="bg-gray-100 rounded-lg p-4 hover:shadow-lg transition-shadow shadow-lg"
            >
              <h3 className="text-sm text-gray-800 font-medium">
                {metric.title}
              </h3>
              <p className="text-2xl font-bold text-indigo-600">
                {metric.value}
              </p>
              <p className="text-xs text-gray-500">{metric.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Health News */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="mb-6"
        >
          <h2 className="text-lg font-semibold mb-2">Health News</h2>
          {isNewsLoading ? (
            <div className="flex justify-center items-center h-24">
              <BarLoader
                color="#B95CF4"
                loading={true}
              />
            </div>
          ) : newsError ? (
            <div className="text-red-500">{newsError}</div>
          ) : (
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {news.map((item) => (
                <div
                  key={item.id}
                  className="min-w-[220px] max-w-xs bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer flex-shrink-0 border border-gray-100"
                  onClick={() => setSelectedNews(item)}
                >
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={320}
                      height={128}
                      className="w-full h-32 object-cover rounded-t-lg"
                      priority={false}
                      loading="lazy"
                    />
                  )}
                  <div className="p-3">
                    <h3 className="font-medium text-base mb-1 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {getShortDescription(item.content)}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Dialog
            open={!!selectedNews}
            onOpenChange={() => setSelectedNews(null)}
          >
            <AnimatePresence>
              {selectedNews && (
                <DialogContent className="max-w-md w-[92vw] p-0 overflow-hidden rounded-2xl shadow-2xl border border-gray-200 bg-white">
                  <motion.div
                    key={selectedNews.id}
                    initial={{ opacity: 0, scale: 0.96, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 20 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    className="relative flex flex-col max-h-[90vh]"
                  >
                    <div className="sticky top-0 z-10 bg-white/90 backdrop-blur flex items-center justify-between px-5 pt-4 pb-2 border-b border-gray-100">
                      <DialogHeader className="flex-1">
                        <DialogTitle className="text-md font-bold leading-tight line-clamp-2 pr-8">
                          {selectedNews.title}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="flex items-center gap-2">
                        {aiSummary && !showOriginal ? (
                          <button
                            className="flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium shadow focus:outline-none transition-all duration-200"
                            onClick={() => setShowOriginal(true)}
                            aria-label="Show original news"
                            type="button"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                            Original
                          </button>
                        ) : (
                          <button
                            className="flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-50 hover:bg-yellow-100 text-yellow-700 text-xs font-medium shadow focus:outline-none transition-all duration-200"
                            onClick={handleSummarize}
                            aria-label="Summarize news"
                            type="button"
                            disabled={isSummarizing}
                          >
                            <Sparkles className="w-4 h-4" />
                            Summarize
                          </button>
                        )}
                        <button
                          className="ml-2 flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium shadow focus:outline-none transition-all duration-200"
                          onClick={() => setSelectedNews(null)}
                          aria-label="Close news dialog"
                          type="button"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Close
                        </button>
                      </div>
                    </div>
                    {/* Image */}
                    {selectedNews.imageUrl && (
                      <Image
                        src={selectedNews.imageUrl}
                        alt={selectedNews.title}
                        width={320}
                        height={128}
                        className="w-full aspect-[16/9] object-cover rounded-b-none rounded-t-lg shadow-sm"
                        priority={false}
                        loading="lazy"
                      />
                    )}
                    {/* Author and meta */}
                    <div className="flex items-center gap-2 px-5 pt-3 pb-1">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm">
                        {selectedNews.author
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span className="text-xs text-gray-700 font-medium">
                        {selectedNews.author}
                      </span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-xs text-gray-500">
                        {new Date(selectedNews.publishedAt).toLocaleDateString(
                          undefined,
                          { year: "numeric", month: "short", day: "numeric" }
                        )}
                      </span>
                    </div>
                    <hr className="mx-5 my-2 border-gray-200" />
                    {/* Scrollable content */}
                    <motion.div
                      key={aiSummary ? "ai-summary" : "original"}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.4, type: "spring" }}
                      className="flex-1 overflow-y-auto px-5 pb-5 prose prose-sm max-w-none text-gray-800 whitespace-pre-line"
                      style={{ WebkitOverflowScrolling: "touch" }}
                    >
                      {isSummarizing ? (
                        <div className="flex flex-col items-center justify-center h-40 animate-pulse text-center">
                          <Sparkles className="w-8 h-8 text-yellow-400 mb-2 animate-bounce" />
                          <span className="text-base font-semibold text-gray-700 mb-1">
                            Summarizing...
                          </span>
                          <span className="text-xs text-gray-400">
                            AI is reading and summarizing this news for you.
                          </span>
                        </div>
                      ) : aiSummary && !showOriginal ? (
                        <motion.div
                          key="ai-summary"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 22,
                          }}
                          className="prose prose-sm max-w-none text-gray-800 whitespace-pre-line"
                        >
                          {aiSummary.split("\n").map((para, idx) => (
                            <p
                              key={idx}
                              className="mb-3 last:mb-0 leading-relaxed text-base text-gray-800"
                            >
                              {para}
                            </p>
                          ))}
                        </motion.div>
                      ) : (
                        <Markdown options={{ forceBlock: true }}>
                          {selectedNews.content}
                        </Markdown>
                      )}
                    </motion.div>
                  </motion.div>
                </DialogContent>
              )}
            </AnimatePresence>
          </Dialog>
        </motion.div>

        {/* Challenges */}
        <div className="mb-6">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="font-semibold text-gray-800 mb-4 text-lg tracking-tight"
          >
            Current Challenges
          </motion.h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {isChallengesLoading ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-gray-500 text-sm col-span-full flex justify-center items-center"
              >
                <BarLoader
                  color="#B95CF4"
                  loading={true}
                />
              </motion.div>
            ) : challengesError ? (
              <motion.div className="text-red-500 text-sm col-span-full">
                {challengesError}
              </motion.div>
            ) : filteredChallenges.length === 0 ? (
              <div className="text-gray-500 text-sm col-span-full">
                No challenges found.
              </div>
            ) : (
              filteredChallenges
                .slice(0, visibleCount)
                .map((challenge: Challenge, idx: number) => {
                  const isCompleted = completedChallengeIds.includes(
                    challenge.id
                  )
                  return (
                    <motion.div
                      key={challenge.id}
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{
                        delay: idx * 0.08 + 0.1,
                        type: "spring",
                        stiffness: 100,
                      }}
                      className={cn(
                        "relative rounded-xl border shadow-md p-3 flex flex-col gap-3 transition-all cursor-pointer group hover:shadow-lg",
                        isCompleted
                          ? "bg-gray-100 border-gray-300 opacity-90"
                          : "bg-white hover:border-blue-400"
                      )}
                      onClick={() =>
                        !isCompleted &&
                        router.push(`/challenge/${challenge.id}`)
                      }
                      style={{
                        filter: isCompleted ? "grayscale(0.2)" : undefined,
                        pointerEvents: isCompleted ? "auto" : undefined,
                      }}
                    >
                      {isCompleted && (
                        <motion.div
                          initial={{ scale: 0.7, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="absolute inset-y-0 right-2 z-10 flex flex-col items-end justify-center gap-2"
                        >
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-300 text-gray-700 text-xs font-bold shadow">
                            <svg
                              className="w-4 h-4 mr-1 text-gray-600"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Completed
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 text-xs font-bold shadow-sm border border-gray-300">
                            +{challenge.rewardAmount}
                          </span>
                        </motion.div>
                      )}
                      <div className="flex items-center gap-3 mb-1">
                        <span
                          className={cn(
                            "inline-flex items-center justify-center w-8 h-8 rounded-full",
                            challenge.conditionKey.includes("water")
                              ? "bg-blue-100 text-blue-500"
                              : "bg-indigo-100 text-indigo-500"
                          )}
                        >
                          <Clock className="w-5 h-5" />
                        </span>
                        <div className="flex-1">
                          <h3
                            className={cn(
                              "text-base font-semibold truncate",
                              isCompleted ? "text-gray-500" : "text-gray-800"
                            )}
                          >
                            {challenge.description}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {challenge.conditionValue} {challenge.unit} •{" "}
                            {challenge.timeFrame}
                          </p>
                        </div>
                        {!isCompleted && (
                          <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-200 text-yellow-800 text-xs font-bold shadow-sm border border-yellow-300">
                            +{challenge.rewardAmount}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )
                })
            )}
          </div>
          {filteredChallenges.length > visibleCount && (
            <div className="flex justify-center mt-4">
              <button
                className="px-4 py-2 rounded-md bg-purple-400 text-white font-semibold text-sm shadow hover:bg-purple-500 transition-colors flex items-center gap-2"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore && (
                  <BarLoader
                    color="#ffffff"
                    height={4}
                    width={100}
                  />
                )}
                {!isLoadingMore && "Load more"}
              </button>
            </div>
          )}
        </div>
        {/* Quick Access */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <h2 className="font-semibold text-gray-800 mb-2">Quick Access</h2>
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                href: "/profile",
                label: "Profile",
                icon: <User className="h-5 w-5 text-gray-600" />,
              },
              {
                href: "/chat",
                label: "Chatbot",
                icon: <MessageCircle className="h-5 w-5 text-gray-600" />,
              },
              {
                href: "/community",
                label: "Community",
                icon: <Users className="h-5 w-5 text-gray-600" />,
              },
            ].map((item) => (
              <motion.div
                key={item.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  href={item.href}
                  className="flex flex-col items-center justify-center bg-gray-100 rounded-lg py-4 focus:ring-2 focus:ring-indigo-400 outline-none shadow-lg"
                >
                  <div className="bg-gray-200 p-2 rounded-full mb-1">
                    {item.icon}
                  </div>
                  <span className="text-xs">{item.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
      <BottomNavigation />

      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="bg-white rounded-2xl shadow-2xl p-6 w-[90vw] max-w-sm flex flex-col items-center"
          >
            <div className="flex flex-col items-center gap-2">
              <LogOut className="w-10 h-10 text-red-500 mb-2" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Confirm Logout
              </h3>
              <p className="text-sm text-gray-600 text-center mb-4">
                Are you sure you want to log out? You will need to log in again
                to access your account.
              </p>
            </div>
            <div className="flex w-full gap-3 mt-2">
              <button
                className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
                onClick={() => setIsLogoutModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition shadow"
                onClick={() => {
                  setIsLogoutModalOpen(false)
                  handleLogout()
                }}
              >
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

export default HomePage
