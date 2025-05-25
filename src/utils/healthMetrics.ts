interface ProfileData {
  age: number | null
  gender: string
  height: number | null
  weight: number | null
}

export const calculateBMI = (
  height: number | null,
  weight: number | null
): number | null => {
  if (!height || !weight) return null
  // Convert height from cm to meters
  const heightInMeters = height / 100
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1))
}

export const calculateBMR = (profile: ProfileData): number | null => {
  if (!profile.age || !profile.height || !profile.weight) return null

  // Using Mifflin-St Jeor Equation
  let bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age

  // Add gender factor
  if (profile.gender === "male") {
    bmr += 5
  } else if (profile.gender === "female") {
    bmr -= 161
  }

  return Math.round(bmr)
}

export const calculateDailyCalories = (
  bmr: number | null,
  activityLevel: number = 1.2
): number | null => {
  if (!bmr) return null
  return Math.round(bmr * activityLevel)
}

export const getBMIStatus = (bmi: number | null): string => {
  if (!bmi) return "Unknown"
  if (bmi < 18.5) return "Underweight"
  if (bmi < 25) return "Normal"
  if (bmi < 30) return "Overweight"
  return "Obese"
}

export const calculateIdealWeight = (
  height: number | null,
  gender: string
): number | null => {
  if (!height) return null
  // Using Devine Formula
  const heightInInches = height / 2.54
  let idealWeight = 50 + 2.3 * (heightInInches - 60)

  if (gender === "female") {
    idealWeight -= 2.5
  }

  return Math.round(idealWeight)
}
