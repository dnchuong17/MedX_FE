/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { verifyOtp } from "@/utils/api"

interface VerificationProps {
  phoneNumber?: string
}

const Verification: React.FC<VerificationProps> = ({
  phoneNumber = "•••••788",
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [activeInput, setActiveInput] = useState<number>(0)
  const [timeLeft, setTimeLeft] = useState<number>(59)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null))

  // Handle timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft])

  const formatTime = (time: number): string => {
    return `${time < 10 ? "0" : ""}${time}`
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.split("").slice(0, 6)
      const newOtp = [...otp]

      digits.forEach((digit, idx) => {
        if (idx + index < 6) {
          newOtp[idx + index] = digit
        }
      })

      setOtp(newOtp)

      const nextEmptyIndex = newOtp.findIndex((val) => val === "")
      if (nextEmptyIndex !== -1) {
        setActiveInput(nextEmptyIndex)
        inputRefs.current[nextEmptyIndex]?.focus()
      } else {
        setActiveInput(5)
        inputRefs.current[5]?.focus()
      }
    } else {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      if (value !== "" && index < 5) {
        setActiveInput(index + 1)
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        setActiveInput(index - 1)
        inputRefs.current[index - 1]?.focus()
      } else {
        const newOtp = [...otp]
        newOtp[index] = ""
        setOtp(newOtp)
      }
      e.preventDefault()
    } else if (e.key === "ArrowLeft" && index > 0) {
      setActiveInput(index - 1)
      inputRefs.current[index - 1]?.focus()
      e.preventDefault()
    } else if (e.key === "ArrowRight" && index < 5) {
      setActiveInput(index + 1)
      inputRefs.current[index + 1]?.focus()
      e.preventDefault()
    }
  }

  const handleNumberClick = (number: string) => {
    if (activeInput < 6) {
      handleOtpChange(activeInput, number)
    }
  }

  const handleDeleteClick = () => {
    if (activeInput >= 0) {
      handleKeyDown(
        {
          key: "Backspace",
          preventDefault: () => {},
        } as React.KeyboardEvent<HTMLInputElement>,
        activeInput
      )
    }
  }

  const handleSubmit = async () => {
    const otpValue = otp.join("")
    if (otpValue.length === 6 && email) {
      setIsLoading(true)
      try {
        await verifyOtp({ email, otp: otpValue })
        // Success: redirect or show success message
        router.push("/home")
      } catch (err: any) {
        // Show error to user
        alert("OTP verification failed: " + (err.message || "Unknown error"))
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleResendCode = () => {
    if (timeLeft <= 0) {
      setTimeLeft(59)
    }
  }

  return (
    <div className="h-screen w-full flex flex-col bg-white">
      <div className="flex-1 flex flex-col px-6 pt-2 pb-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link
            href="/login"
            className="text-indigo-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <h1 className="flex-1 text-center text-xl font-semibold text-indigo-600">
            Verification
          </h1>
          <div className="w-6"></div> {/* Placeholder for balanced layout */}
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-indigo-600 mb-2 flex items-center">
              Enter OTP
              <span className="ml-3 text-2xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 inline-block"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect
                    x="5"
                    y="2"
                    width="14"
                    height="20"
                    rx="2"
                    ry="2"
                  ></rect>
                  <line
                    x1="12"
                    y1="18"
                    x2="12"
                    y2="18"
                  ></line>
                </svg>
              </span>
            </h2>
            <p className="text-gray-600">
              We&apos;ve sent a 6-digit code to ({phoneNumber}).
              <br />
              Enter it below to verify your number.
            </p>
          </div>

          {/* OTP input fields */}
          <div className="flex justify-between mb-8">
            {otp.map((digit, index) => (
              <React.Fragment key={index}>
                <input
                  ref={(el) => {
                    if (el) {
                      inputRefs.current[index] = el
                    }
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  className="w-12 h-16 bg-gray-100 rounded-lg text-center text-xl font-semibold border-0 focus:ring-2 focus:ring-indigo-500 focus:bg-gray-50"
                  value={digit}
                  onChange={(e) =>
                    handleOtpChange(
                      index,
                      e.target.value.replace(/[^0-9]/g, "")
                    )
                  }
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={() => setActiveInput(index)}
                  autoComplete="off"
                />
                {index === 2 && (
                  <div className="flex items-center mx-2">
                    <div className="w-3 h-1 bg-gray-300 rounded"></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Resend code timer */}
          <div className="mb-8">
            <button
              onClick={handleResendCode}
              disabled={timeLeft > 0}
              className={`text-lg font-medium ${
                timeLeft > 0 ? "text-gray-500" : "text-indigo-600"
              }`}
            >
              Resend Code in {timeLeft > 0 ? `${formatTime(timeLeft)}` : "0:00"}
            </button>
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={otp.join("").length !== 6 || isLoading}
            className="w-full py-3 bg-indigo-600 text-white rounded-full font-medium tracking-wide transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
          >
            {isLoading ? "Verifying..." : "Submit"}
          </button>
        </div>

        {/* Number pad */}
        <div className="grid grid-cols-3 gap-6 mt-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <button
              key={number}
              onClick={() => handleNumberClick(number.toString())}
              className="w-14 h-14 mx-auto text-2xl font-semibold text-gray-800 focus:outline-none"
            >
              {number}
            </button>
          ))}
          <div></div> {/* Empty space for layout */}
          <button
            onClick={() => handleNumberClick("0")}
            className="w-14 h-14 mx-auto text-2xl font-semibold text-gray-800 focus:outline-none"
          >
            0
          </button>
          <button
            onClick={handleDeleteClick}
            className="w-14 h-14 mx-auto flex items-center justify-center focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
              />
            </svg>
          </button>
        </div>

        {/* Home indicator */}
        <div className="mt-6 flex justify-center">
          <div className="w-32 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

export default Verification
