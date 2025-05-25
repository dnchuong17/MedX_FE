"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"

export default function SplashScreen() {
  const router = useRouter()

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/welcome")
    }, 1200)
    return () => clearTimeout(timeout)
  }, [router])

  const logoVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  return (
    <main className="min-h-dvh w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <style
        jsx
        global
      >{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-slow {
          background-size: 200% 200%;
          animation: gradient 6s ease infinite;
        }
      `}</style>
      <motion.div
        className="flex flex-col items-center justify-center"
        initial="hidden"
        animate="visible"
        variants={logoVariants}
      >
        <Image
          src="/image/logo.svg"
          alt="MedX Logo"
          width={120}
          height={120}
          priority
        />
        <h1 className="mt-8 text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-slow">
          MedX
        </h1>
        <div className="mt-10 w-64 h-2 bg-white/50 rounded-full overflow-hidden shadow-sm">
          <motion.div
            className="h-2 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </main>
  )
}
