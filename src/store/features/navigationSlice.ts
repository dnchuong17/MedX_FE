import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type NavigationTab = "home" | "profile" | "chat" | "booking"

interface NavigationState {
  activeTab: NavigationTab
}

const initialState: NavigationState = {
  activeTab: "home",
}

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<NavigationTab>) => {
      state.activeTab = action.payload
    },
  },
})

export const { setActiveTab } = navigationSlice.actions
export default navigationSlice.reducer
