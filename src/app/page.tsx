"use client"

import { useState, useEffect } from "react"
import SplashScreen from "@/app/splash/page"
import LoginPage from "@/app/auth/login/page"

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true)

  // This simulates checking for authentication state or other initialization
  useEffect(() => {
    // You can add any app initialization logic here
    const initTimeout = setTimeout(() => {
      setLoading(false)
    }, 300000)

    return () => clearTimeout(initTimeout)
  }, [])

  return <main>{loading ? <SplashScreen /> : <LoginPage />}</main>
}
