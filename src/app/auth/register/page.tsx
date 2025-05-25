/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Eye,
  EyeOff,
  ArrowRight,
  Loader,
  CheckCircle,
  User,
  Mail,
  Key,
  Phone,
} from "lucide-react"
import Link from "next/link"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import "@solana/wallet-adapter-react-ui/styles.css"
import {
  registerByPhone,
  setEmailAfterPhone,
  verifyOtp,
  registerByEmail,
  loginWallet,
  setAuthToken,
} from "@/utils/api"
import { AnimatePresence, motion } from "framer-motion"
import bs58 from "bs58"

type RegisterMethod = "Email" | "Phone"

const tabList: RegisterMethod[] = ["Email", "Phone"]

const stepVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -30, transition: { duration: 0.2 } },
}

const RegisterPageContent = () => {
  const router = useRouter()
  const { connected, publicKey, signMessage, disconnect } = useWallet()
  const [registerMethod, setRegisterMethod] = useState<RegisterMethod>("Email")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [step, setStep] = useState<
    "register" | "setPassword" | "setEmail" | "verifyOtp"
  >("register")
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)
  const [otp, setOtp] = useState("")
  const [walletError, setWalletError] = useState<string | null>(null)
  const [walletLoading, setWalletLoading] = useState(false)

  useEffect(() => {
    // Reset wallet error when connection changes
    if (connected) {
      setWalletError(null)
    }
  }, [connected, publicKey])

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setFeedback(null)
    if (registerMethod === "Phone") {
      setIsLoading(false)
      setStep("setPassword")
    } else {
      try {
        if (!password || password !== confirmPassword) {
          setFeedback({
            type: "error",
            message: "Passwords do not match",
          })
          setIsLoading(false)
          return
        }
        await registerByEmail({ email, password, name: fullName })
        setFeedback({
          type: "success",
          message: "Registration successful! Please verify your email.",
        })
        setTimeout(() => {
          setFeedback(null)
          setStep("verifyOtp")
        }, 1500)
      } catch (err: any) {
        setFeedback({
          type: "error",
          message: "Register error: " + (err.message || JSON.stringify(err)),
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  async function handlePhonePassword(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setFeedback(null)
    try {
      await registerByPhone({ name: fullName, phone: phoneNumber, password })
      setStep("setEmail")
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: "Register error: " + (err.message || JSON.stringify(err)),
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSetEmail(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setFeedback(null)
    try {
      await setEmailAfterPhone(phoneNumber, email)
      setStep("verifyOtp")
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: "Set email error: " + (err.message || JSON.stringify(err)),
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setFeedback(null)
    try {
      await verifyOtp({ email, otp })
      setFeedback({ type: "success", message: "Verification successful!" })
      setTimeout(() => router.push("/home"), 1200)
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: "OTP error: " + (err.message || JSON.stringify(err)),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleWalletLogin = useCallback(async () => {
    setWalletError(null)
    setWalletLoading(true)

    if (!connected) {
      setWalletError("Please connect your wallet first.")
      setWalletLoading(false)
      return
    }

    if (!publicKey) {
      setWalletError("Unable to detect wallet public key.")
      setWalletLoading(false)
      return
    }

    if (!signMessage) {
      setWalletError("Your wallet does not support message signing.")
      setWalletLoading(false)
      return
    }

    try {
      const message = `Login to MedX at ${new Date().toISOString()}`
      const encodedMessage = new TextEncoder().encode(message)

      let signatureUint8
      try {
        signatureUint8 = await signMessage(encodedMessage)
      } catch (signErr: unknown) {
        if (signErr instanceof Error) {
          if (signErr.message?.includes("User rejected")) {
            setWalletError("You declined to sign the authentication message.")
          } else {
            setWalletError(
              `Signature failed: ${signErr.message || "Unknown error"}`
            )
          }
        } else {
          setWalletError("Signature failed: Unknown error")
        }
        setWalletLoading(false)
        return
      }

      const signature = bs58.encode(signatureUint8)

      const response = await loginWallet({
        wallet_address: publicKey.toBase58(),
        message,
        signature,
      })

      const token = response.token
      if (token) {
        localStorage.setItem("accessToken", token)
        setAuthToken(token)

        console.log("Wallet login token:", token)
        console.log(
          "Token in localStorage:",
          localStorage.getItem("accessToken")
        )

        setFeedback({
          type: "success",
          message: "Wallet login successful! Redirecting...",
        })

        setTimeout(() => {
          router.push("/home")
        }, 1200)
      } else {
        throw new Error("No token received from server")
      }
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data
      ) {
        setWalletError(
          (err.response.data as { message?: string }).message ||
            "Wallet login failed."
        )
      } else if (err instanceof Error) {
        setWalletError(err.message)
      } else {
        setWalletError("Wallet login failed.")
      }
    } finally {
      setWalletLoading(false)
    }
  }, [connected, publicKey, signMessage, router])

  // Add a handler for disconnecting wallet
  const handleDisconnectWallet = useCallback(async () => {
    if (disconnect) {
      try {
        await disconnect()
      } catch {
        if (typeof window !== "undefined") {
          window.location.reload()
        }
      }
    } else if (typeof window !== "undefined") {
      window.location.reload()
    }
  }, [disconnect])

  function FeedbackToast() {
    const displayMessage = feedback?.message || walletError
    const displayType = feedback?.type || "error"

    if (!displayMessage) return null

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`fixed top-6 left-1/2 z-50 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-medium ${
            displayType === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {displayMessage}
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <FeedbackToast />
      <div className="w-full flex flex-col items-center pt-8 pb-4">
        <div className="flex items-center w-full max-w-md px-4">
          <Link href={step === "register" ? "/auth/login" : "#"}>
            <button
              className="p-2 rounded-full bg-white shadow hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-indigo-400 transition"
              onClick={
                step === "setPassword" ? () => setStep("register") : undefined
              }
              type="button"
              aria-label="Back"
            >
              <ArrowLeft
                size={22}
                className="text-indigo-600"
              />
            </button>
          </Link>
          <h1 className="flex-1 text-center text-indigo-700 text-2xl font-bold tracking-tight">
            {step === "register"
              ? "Register"
              : step === "setPassword"
              ? "Set Password"
              : step === "setEmail"
              ? "Set Email"
              : "Verify OTP"}
          </h1>
          <div className="w-10" /> {/* Spacer for symmetry */}
        </div>
        <div className="w-full max-w-md mt-6">
          <div className="flex bg-white shadow overflow-hidden">
            {tabList.map((method) => (
              <button
                key={method}
                onClick={() => setRegisterMethod(method)}
                className={`flex-1 py-3 text-center font-medium transition focus:outline-none text-base flex items-center justify-center gap-2 ${
                  registerMethod === method
                    ? "text-indigo-700 bg-indigo-50 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-indigo-600 bg-white"
                }`}
                type="button"
                aria-selected={registerMethod === method}
              >
                {method === "Email" && <Mail className="w-5 h-5" />}
                {method === "Phone" && <Phone className="w-5 h-5" />}
                <span>{method}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col justify-center">
        <AnimatePresence
          mode="wait"
          initial={false}
        >
          {step === "register" && (
            <motion.div
              key="register"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-8"
            >
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Welcome</h2>
                <p className="text-gray-600">
                  Create a new account using your preferred method
                </p>
              </div>
              <form
                onSubmit={handleRegister}
                className="space-y-4"
              >
                <AnimatePresence
                  mode="wait"
                  initial={false}
                >
                  <motion.div
                    key="fields"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-2"
                  >
                    {registerMethod === "Email" && (
                      <>
                        <div className="flex items-center gap-2">
                          <User className="text-gray-500" />
                          <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full p-3 rounded-lg bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition focus:outline-none"
                            placeholder="Full name"
                            required
                            autoComplete="name"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="text-gray-500" />
                          <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded-lg bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition focus:outline-none"
                            placeholder="Email"
                            required
                            autoComplete="email"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Key className="text-gray-500" />
                          <div className="relative w-full">
                            <input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full p-3 rounded-lg bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition focus:outline-none"
                              placeholder="Password"
                              required
                              autoComplete="new-password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-gray-500 hover:text-indigo-600"
                              tabIndex={-1}
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }
                            >
                              {showPassword ? (
                                <EyeOff size={20} />
                              ) : (
                                <Eye size={20} />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Key className="text-gray-500" />
                          <div className="relative w-full">
                            <input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                              className="w-full p-3 rounded-lg bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition focus:outline-none"
                              placeholder="Confirm password"
                              required
                              autoComplete="new-password"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-3 text-gray-500 hover:text-indigo-600"
                              tabIndex={-1}
                              aria-label={
                                showConfirmPassword
                                  ? "Hide password"
                                  : "Show password"
                              }
                            >
                              {showConfirmPassword ? (
                                <EyeOff size={20} />
                              ) : (
                                <Eye size={20} />
                              )}
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                    {registerMethod === "Phone" && (
                      <>
                        <div className="flex items-center gap-2">
                          <User className="text-gray-500" />
                          <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full p-3 rounded-lg bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition focus:outline-none"
                            placeholder="Full name"
                            required
                            autoComplete="name"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="text-gray-500" />
                          <input
                            id="phoneNumber"
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full p-3 rounded-lg bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition focus:outline-none"
                            placeholder="Phone number"
                            required
                            autoComplete="tel"
                          />
                        </div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium transition hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:opacity-60"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader className="animate-spin h-5 w-5 text-white" />
                      Loading...
                    </span>
                  ) : (
                    "Continue"
                  )}
                </button>
              </form>
              <div className="flex flex-col items-center justify-center mt-4 my-4 min-h-[220px]">
                <div className="text-gray-800 font-medium mb-1 text-center">
                  Register with Solana Wallet
                </div>
                <p className="text-gray-600 text-sm text-center">
                  Connect your Solana wallet to register a new account
                </p>
                {connected && (
                  <div className="flex items-center justify-center gap-2 text-green-600 my-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      Wallet Connected
                    </span>
                  </div>
                )}
                {connected ? (
                  <div className="flex gap-4 w-full items-center">
                    <button
                      type="button"
                      onClick={handleDisconnectWallet}
                      className="w-full max-w-xs bg-gray-200 text-gray-800 py-3 rounded-lg font-medium transition hover:bg-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    >
                      Change Wallet
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push("/home")}
                      className="w-full max-w-xs bg-indigo-600 text-white py-3 rounded-lg font-medium transition hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    >
                      Go to Home
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center items-center gap-4 w-full">
                    <WalletMultiButton className="w-full max-w-xs" />
                    <button
                      type="button"
                      onClick={handleWalletLogin}
                      disabled={!connected || walletLoading}
                      aria-label="Continue with connected wallet"
                      className={`flex items-center justify-center p-3 rounded-full bg-indigo-600 text-white transition hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:opacity-60 ${
                        !connected || walletLoading ? "cursor-not-allowed" : ""
                      }`}
                    >
                      {walletLoading ? (
                        <Loader className="animate-spin h-5 w-5 text-white" />
                      ) : (
                        <ArrowRight size={20} />
                      )}
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="text-indigo-600 font-medium hover:underline"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </motion.div>
          )}
          {step === "setPassword" && (
            <motion.div
              key="setPassword"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-8"
            >
              <form
                onSubmit={handlePhonePassword}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-gray-800 font-medium">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 rounded-lg bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                      placeholder="Enter password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-500 hover:text-indigo-600"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-gray-800 font-medium">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-3 rounded-lg bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                      placeholder="Confirm password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-3 text-gray-500 hover:text-indigo-600"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium transition hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:opacity-60"
                  disabled={isLoading || password !== confirmPassword}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader className="animate-spin h-5 w-5 text-white" />
                      Creating...
                    </span>
                  ) : (
                    "Continue"
                  )}
                </button>
              </form>
            </motion.div>
          )}
          {step === "setEmail" && (
            <motion.div
              key="setEmail"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-8"
            >
              <form
                onSubmit={handleSetEmail}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-gray-800 font-medium">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    placeholder="example@example.com"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium transition hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:opacity-60"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Continue"}
                </button>
              </form>
            </motion.div>
          )}
          {step === "verifyOtp" && (
            <motion.div
              key="verifyOtp"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-8"
            >
              <form
                onSubmit={handleVerifyOtp}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-gray-800 font-medium">OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    placeholder="Enter OTP"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium transition hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:opacity-60"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default RegisterPageContent
