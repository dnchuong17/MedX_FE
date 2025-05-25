import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface ProfileState {
  age: number | null
  gender: string
  height: number | null
  weight: number | null
  userId: string | null
  isProfileComplete: boolean
}

const initialState: ProfileState = {
  age: null,
  gender: "",
  height: null,
  weight: null,
  userId: null,
  isProfileComplete: false,
}

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfileData: (state, action: PayloadAction<Partial<ProfileState>>) => {
      return { ...state, ...action.payload }
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload
    },
    clearProfile: () => initialState,
  },
})

export const { setProfileData, setUserId, clearProfile } = profileSlice.actions
export default profileSlice.reducer
