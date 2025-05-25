"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import BottomNavigation from "@/components/navbar"
import { useRouter } from "next/navigation"
import {
  FaUserCircle,
  FaHeartbeat,
  FaWallet,
  FaLock,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaChevronRight,
  FaArrowLeft,
  FaCamera,
  FaBell,
} from "react-icons/fa"
import { getCurrentUser } from "@/utils/api"
import type { User } from "@/utils/interface"
import { BarLoader } from "react-spinners"
import PageHeader from "@/components/pagination";
interface MenuItemProps {
  icon: React.ReactNode
  label: string
  onClick?: () => void
}

const MenuItem = ({ icon, label, onClick }: MenuItemProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center justify-between p-4 rounded-xl hover:bg-[#EEF0FF] cursor-pointer transition-colors active:bg-[#E8E9FF]"
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <div className="bg-[#EEF0FF] p-3 rounded-full text-[#6C4FF7]">
          {icon}
        </div>
        <span className="text-gray-700 text-base font-medium">{label}</span>
      </div>
      <FaChevronRight className="w-4 h-4 text-gray-400" />
    </motion.div>
  )
}

export default function ProfilePage() {
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getCurrentUser()
        setUser(userData)
      } catch (err: unknown) {
        function isErrorWithMessage(e: unknown): e is { message: string } {
          return (
            typeof e === "object" &&
            e !== null &&
            "message" in e &&
            typeof (e as { message: unknown }).message === "string"
          )
        }
        let message = "Failed to load user info"
        if (isErrorWithMessage(err)) {
          message = err.message
        }
        setError(message)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <BarLoader color="#6C4FF7" />
        <span className="text-sm text-gray-500">Loading profile...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <span className="text-lg font-bold text-red-500">{error}</span>
        <button
          onClick={() => router.push("/auth/login")}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Go to Login
        </button>
      </div>
    )
  }

  const handleMenuItemClick = (label: string) => {
    switch (label) {
      case "Profile":
        router.push("/profile/edit-profile")
        break
      case "Medical Records":
        router.push("/health-record")
        break
      case "Wallet":
        router.push("/wallet")
        break
      case "Privacy Policy":
        router.push("/privacy-policy")
        break
      case "Settings":
        router.push("/settings")
        break
      case "Help":
        router.push("/help")
        break
      case "Logout":
        localStorage.removeItem("accessToken")
        router.push("/auth/login")
        break
      default:
        break
    }
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-b from-[#f5f5fa] to-white overflow-hidden">
      {/* Content Container */}
      <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          className="flex-1 bg-white w-full overflow-y-auto shadow-lg rounded-b-3xl"
      >
        {/* Header with Back Button and Title */}
        <div className="p-4 flex items-center justify-between">
          <PageHeader title="My Profile"/>
        </div>

        {/* Profile Picture */}
        <div className="flex flex-col items-center p-6">
          <motion.div
              initial={{scale: 0.8, opacity: 0}}
              animate={{scale: 1, opacity: 1}}
              transition={{delay: 0.2}}
              className="relative"
          >
            <div className="relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-[#EEF0FF] shadow-lg">
              <Image
                  src="/7Foods.png"
                  alt="Profile"
                  fill
                  className="object-cover"
                  priority
              />
            </div>
            <motion.button
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.95}}
                className="absolute bottom-0 right-0 bg-[#6C4FF7] rounded-full p-2 shadow-lg hover:bg-[#5a3fd9] transition-colors"
            >
              <FaCamera className="w-4 h-4 text-white"/>
            </motion.button>
          </motion.div>
          <motion.h3
              initial={{opacity: 0, y: 10}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 0.3}}
              className="text-2xl font-bold mt-6 text-gray-800"
          >
            {user?.name || "No Name"}
          </motion.h3>
          <motion.p
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 0.4}}
              className="text-gray-500 mt-1"
          >
            {user?.email || "No Email"}
          </motion.p>
        </div>

        {/* Menu */}
        <div className="px-6 pb-6">
          <AnimatePresence>
            {[
              {icon: <FaUserCircle className="w-5 h-5"/>, label: "Profile"},
              {
                icon: <FaHeartbeat className="w-5 h-5"/>,
                label: "Medical Records",
              },
              {icon: <FaWallet className="w-5 h-5"/>, label: "Wallet"},
              {icon: <FaLock className="w-5 h-5"/>, label: "Privacy Policy"},
              {icon: <FaCog className="w-5 h-5"/>, label: "Settings"},
              {icon: <FaQuestionCircle className="w-5 h-5"/>, label: "Help"},
              {icon: <FaSignOutAlt className="w-5 h-5"/>, label: "Logout"},
            ].map((item, index) => (
                <motion.div
                    key={item.label}
                    initial={{opacity: 0, x: -20}}
                    animate={{opacity: 1, x: 0}}
                    transition={{delay: index * 0.1}}
                >
                  <MenuItem
                      icon={item.icon}
                      label={item.label}
                      onClick={() => handleMenuItemClick(item.label)}
                  />
                </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="flex-shrink-0">
        <BottomNavigation/>
      </div>
    </div>
  )
}
