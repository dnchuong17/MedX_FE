"use client"

import React, { useState, useEffect } from "react"
import {
  ChevronRight,
  User,
  Calendar,
  Ruler,
  Weight,
  Loader2,
} from "lucide-react"
import {
  getCurrentUser,
  updateUserProfile,
  setAuthToken,
} from "../../../utils/api"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { setProfileData, setUserId } from "@/store/slices/profileSlice"
import type { RootState } from "@/store"

export default function HealthProfileSetup() {
  const router = useRouter()
  const dispatch = useDispatch()
  const userId = useSelector((state: RootState) => state.profile.userId)

  const [currentStep, setCurrentStep] = useState(0)
  const [profileData, setLocalProfileData] = useState<{
    age: number | null
    gender: string
    height: number | null
    weight: number | null
  }>({
    age: null,
    gender: "",
    height: null,
    weight: null,
  })

  const [loading, setLoading] = useState(true)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [error, setError] = useState("")

  const steps = [
    {
      id: "age",
      title: "Your Age",
      subtitle: "This information helps us personalize your experience",
      icon: Calendar,
      type: "input",
      placeholder: "Enter your age",
      unit: "age",
    },
    {
      id: "gender",
      title: "Gender",
      subtitle: "Select the gender that fits you",
      icon: User,
      type: "selection",
      options: [
        { value: "male", label: "Male", emoji: "👨" },
        { value: "female", label: "Female", emoji: "👩" },
      ],
    },
    {
      id: "height",
      title: "Height",
      subtitle: "Measure your height without shoes",
      icon: Ruler,
      type: "input",
      placeholder: "Enter your height",
      unit: "cm",
    },
    {
      id: "weight",
      title: "Weight",
      subtitle: "Weigh yourself in the morning for the most accurate result",
      icon: Weight,
      type: "input",
      placeholder: "Enter your weight",
      unit: "kg",
    },
  ]

  const currentStepData = steps[currentStep]

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      setError("Authentication token not found. Please log in again.")
      setLoading(false)
      return
    }

    setAuthToken(token)

    async function fetchCurrentUser() {
      try {
        const userData = await getCurrentUser()
        if (!userData?.id) throw new Error("Invalid user data")

        const userId = userData.id.toString()
        dispatch(setUserId(userId))

        const profileData = {
          age: userData.age ?? null,
          gender: userData.gender ?? "",
          height: userData.height ?? null,
          weight: userData.weight ?? null,
        }

        setLocalProfileData(profileData)
        dispatch(setProfileData(profileData))

        if (
          userData.age &&
          userData.gender &&
          userData.height &&
          userData.weight
        ) {
          router.push("/home")
        } else {
          setLoading(false)
        }
      } catch (err: unknown) {
        console.error("Failed to load profile:", err)
        setError("Unable to load profile. Please login again.")
        setLoading(false)
      }
    }

    fetchCurrentUser()
  }, [router, dispatch])

  const handleInputChange = (value: string) => {
    const key = currentStepData.id
    const isNumberField = ["age", "height", "weight"].includes(key)
    setLocalProfileData((prev) => ({
      ...prev,
      [key]: isNumberField ? (value === "" ? null : Number(value)) : value,
    }))
  }

  const saveProfileData = async () => {
    if (!userId) {
      setError("User ID not available. Please log in again.")
      return false
    }

    try {
      setLoading(true)
      console.log("Updating user profile with data:", profileData)
      console.log("User ID:", userId)

      const result = await updateUserProfile(userId, {
        age: profileData.age === null ? undefined : profileData.age,
        gender: profileData.gender === "" ? undefined : profileData.gender,
        height: profileData.height === null ? undefined : profileData.height,
        weight: profileData.weight === null ? undefined : profileData.weight,
      })
      console.log("Profile update result:", result)

      dispatch(setProfileData(profileData))

      setUpdateSuccess(true)
      setLoading(false)
      return true
    } catch (err: unknown) {
      console.error("Failed to update profile:", err)

      if (
        (err instanceof Error && err.message.includes("session")) ||
        (err instanceof Error && err.message.includes("token")) ||
        (err instanceof Error && err.message.includes("log in"))
      ) {
        setError("Your session has expired. Please log in again.")
        localStorage.removeItem("accessToken")
      } else if (
        err instanceof Error &&
        err.message.includes("Invalid profile data")
      ) {
        setError(err.message)
      } else {
        setError("Failed to save your profile. Please try again.")
      }

      setLoading(false)
      return false
    }
  }

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      const success = await saveProfileData()
      if (success) {
        console.log("Profile completed:", profileData)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepValid = () => {
    const value = profileData[currentStepData.id as keyof typeof profileData]
    return value !== null && value !== ""
  }

  const progressPercentage = ((currentStep + 1) / steps.length) * 100

  if (loading && userId === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 text-indigo-600 animate-spin" />
          <p className="text-gray-700">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (updateSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Profile Updated!
          </h2>
          <p className="text-gray-600 mb-6">
            Your health profile has been successfully updated.
          </p>
          <button
            onClick={() => router.push("/home")}
            className="bg-indigo-600 text-white font-medium py-3 px-6 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setError("")
                window.location.reload()
              }}
              className="flex-1 bg-indigo-600 text-white font-medium py-3 px-6 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
            {(error.includes("session") ||
              error.includes("token") ||
              error.includes("log in")) && (
              <button
                onClick={() => router.push("/auth/login")}
                className="flex-1 bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Back to Login
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            {React.createElement(currentStepData.icon, {
              className: "w-8 h-8 text-white",
            })}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Health Profile Setup
          </h1>
          <p className="text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {currentStepData.title}
            </h2>
            <p className="text-gray-600 text-sm">{currentStepData.subtitle}</p>
          </div>

          <div className="mb-8">
            {currentStepData.type === "input" ? (
              <div className="relative">
                <input
                  type="number"
                  value={
                    profileData[
                      currentStepData.id as keyof typeof profileData
                    ] || ""
                  }
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={currentStepData.placeholder}
                  className="w-full p-4 text-center text-xl font-semibold border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                />
                {currentStepData.unit && (
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    {currentStepData.unit}
                  </span>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {currentStepData.options?.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleInputChange(option.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${
                      profileData[
                        currentStepData.id as keyof typeof profileData
                      ] === option.value
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{option.emoji}</span>
                      <span className="font-medium">{option.label}</span>
                    </div>
                    {profileData[
                      currentStepData.id as keyof typeof profileData
                    ] === option.value && (
                      <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="flex-1 py-3 px-4 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!isStepValid() || loading}
              className={`flex-1 py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                isStepValid() && !loading
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {currentStep === steps.length - 1 ? "Saving..." : "Next"}
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {currentStep === steps.length - 1 ? "Complete" : "Next"}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index <= currentStep ? "bg-indigo-600" : "bg-gray-300"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}
