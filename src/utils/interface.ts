export interface RegisterByEmailInput {
  email: string
  password: string
  name: string
}

export interface RegisterByPhoneInput {
  phone: string
  password: string
  name: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface VerifyOtpInput {
  email: string
  otp: string
}

// export interface User {
//   id: string
//   email: string
//   name: string
// }

export interface User {
  id: number
  email: string
  password?: string
  name?: string
  phone?: string
  is_verified: boolean
  otp?: string
  age?: number
  gender?: "male" | "female" | "other" | string
  weight?: number
  height?: number
  wallet_address?: string
  encrypted_key?: string
}

export interface AuthResponse {
  token: string
}

export interface VerifyOtpResponse {
  message: string
}

export interface ApiError {
  message: string
  status?: number
  data?: unknown
}

export interface LoginWalletInput {
  wallet_address: string
  message: string
  signature: string
}

export interface RegisterWalletInput {
  wallet_address: string
  message: string
  signature: string
}

export interface UpdateUserInput {
  age?: string | number
  gender?: string
  height?: string | number
  weight?: string | number
  [key: string]: string | number | undefined
}

export interface UpdateUserResponse {
  id: string
  email?: string
  name?: string
  age?: string | number
  gender?: string
  height?: string | number
  weight?: string | number
  [key: string]: string | number | undefined
}

export interface Challenge {
  id: number
  description: string
  conditionKey: string
  conditionValue: number
  unit: string
  timeFrame: string
  conditionKeywords: string[]
  rewardAmount: number
}

export interface ChallengeInput {
  description: string
  conditionKey: string
  conditionValue: number
  unit: string
  timeFrame: string
  conditionKeywords: string[]
  rewardAmount: number
}

export interface ChallengeCheckInput {
  description: string
  conditionKey: string
  conditionValue: number
  unit: string
  timeFrame: string
}

export interface HealthNews {
  id: number
  title: string
  content: string
  author: string
  publishedAt: string // ISO date string
  imageUrl?: string
}

export interface CreateHealthNewsInput {
  title: string
  content: string
  author: string
  publishedAt: string // ISO date string
}

export interface UpdateHealthNewsInput {
  title?: string
  content?: string
  author?: string
  publishedAt?: string // ISO date string
  image?: File
}

export interface UnsignedRecordResponse {
  recordId: string;
  transaction: string;
}