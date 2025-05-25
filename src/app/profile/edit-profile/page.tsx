"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Settings, Save } from "lucide-react"
import { getCurrentUser, updateUserProfile } from "@/utils/api"
import { UpdateUserInput } from "@/utils/interface"

interface FormData {
  name: string
  age: string
  gender: string
  weight: string
  height: string
  phone: string
  email: string
}

export default function EditProfile() {
  const router = useRouter()

  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
    phone: "",
    email: "",
  })

  const [userId, setUserId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchUserInfo()
  }, [])

  const fetchUserInfo = async () => {
    try {
      setLoading(true)
      console.log("Fetching user information...")

      const userInfo = await getCurrentUser()
      console.log("Fetched user info:", userInfo)

      if (!userInfo) {
        throw new Error("No user information received from server")
      }

      setUserId(userInfo.id.toString())
      setFormData({
        name: userInfo.name || "",
        age: userInfo.age ? userInfo.age.toString() : "",
        gender: userInfo.gender || "",
        weight: userInfo.weight ? userInfo.weight.toString() : "",
        height: userInfo.height ? userInfo.height.toString() : "",
        phone: userInfo.phone || "",
        email: userInfo.email || "",
      })
    } catch (error) {
      console.error("Failed to fetch user info:", error)
      if (error instanceof Error) {
        console.error("Error details:", error.message)
        if (error.message.includes("No authentication token found")) {
          alert("Please log in to access your profile")
          router.push("/auth/login")
          return
        }
      }
      alert("Failed to load user information. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSubmitting(true)
      console.log("Submitting form data:", formData)

      // Prepare data for update (convert strings to numbers where needed)
      const updateData: UpdateUserInput = {
        name: formData.name,
        phone: formData.phone,
        age: formData.age ? parseInt(formData.age) : undefined,
        gender: formData.gender,
        weight: formData.weight ? parseInt(formData.weight) : undefined,
        height: formData.height ? parseInt(formData.height) : undefined,
      }

      console.log("Update data to be sent:", updateData)

      if (!userId) {
        throw new Error("User ID not found")
      }

      const updatedUser = await updateUserProfile(userId, updateData)
      console.log("Profile updated successfully:", updatedUser)

      alert("Profile updated successfully!")

      // Navigate back to profile
      router.push(`/profile`)
    } catch (error) {
      console.error("Failed to update profile:", error)
      alert("Failed to update profile. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-lg text-gray-600">Loading user information...</div>
      </div>
    )
  }

  return (
    <div className="flex justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <button
                type="button"
                className="text-indigo-600 hover:text-indigo-800 transition-colors"
                onClick={() => router.back()}
              >
                <ChevronLeft size={24} />
              </button>
              <span className="text-indigo-600 text-xl font-medium">
                Edit Profile
              </span>
              <button
                type="button"
                className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors"
                onClick={() => router.push("/settings")}
              >
                <Settings size={20} />
              </button>
            </div>

            {/*/!* Profile Photo *!/*/}
            {/*<div className="flex justify-center mb-8">*/}
            {/*    <div className="relative">*/}
            {/*        <div className="h-32 w-32 rounded-full bg-gray-200 overflow-hidden border-4 border-indigo-100">*/}
            {/*            <img*/}
            {/*                src="/api/placeholder/128/128"*/}
            {/*                alt="Profile"*/}
            {/*                className="h-full w-full object-cover"*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*        <button*/}
            {/*            type="button"*/}
            {/*            onClick={handlePhotoChange}*/}
            {/*            className="absolute bottom-0 right-0 bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-colors shadow-lg"*/}
            {/*        >*/}
            {/*            <Camera size={16} />*/}
            {/*        </button>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* Form Fields */}
            <div className="space-y-6">
              <InputField
                label="Full Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />

              {/*<InputField*/}
              {/*    label="Email"*/}
              {/*    name="email"*/}
              {/*    type="email"*/}
              {/*    value={formData.email}*/}
              {/*    onChange={handleChange}*/}
              {/*    disabled*/}
              {/*    className="bg-gray-100"*/}
              {/*    placeholder="Your email address"*/}
              {/*/>*/}

              {/*<InputField*/}
              {/*    label="Phone Number"*/}
              {/*    name="phone"*/}
              {/*    type="tel"*/}
              {/*    value={formData.phone}*/}
              {/*    onChange={handleChange}*/}
              {/*    placeholder="e.g., +1 234 567 8900"*/}
              {/*/>*/}

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  min="1"
                  max="120"
                  placeholder="Age"
                />

                <div>
                  <label className="block text-lg font-medium mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-blue-50 rounded-xl border-0 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Weight (kg)"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  min="1"
                  max="500"
                  placeholder="Weight"
                />

                <InputField
                  label="Height (cm)"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleChange}
                  min="1"
                  max="300"
                  placeholder="Height"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-6 space-y-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-indigo-600 text-white py-4 rounded-full font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Update Profile
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full bg-gray-100 text-gray-700 py-4 rounded-full font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Input field component
function InputField({
  label,
  name,
  type,
  value,
  onChange,
  disabled = false,
  required = false,
  className = "",
  placeholder = "",
  min,
  max,
}: {
  label: string
  name: string
  type: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  required?: boolean
  className?: string
  placeholder?: string
  min?: string
  max?: string
}) {
  return (
    <div>
      <label className="block text-lg font-medium mb-2 text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        min={min}
        max={max}
        className={`w-full px-4 py-3 bg-blue-50 rounded-xl border-0 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-all ${className}`}
      />
    </div>
  )
}
