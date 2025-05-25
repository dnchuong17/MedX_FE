import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface ChallengesState {
  completed: { id: number; completedAt: number }[]
}

const initialState: ChallengesState = {
  completed: [],
}

function isExpired(completedAt: number) {
  return Date.now() - completedAt > 24 * 60 * 60 * 1000
}

const challengesSlice = createSlice({
  name: "challenges",
  initialState,
  reducers: {
    markChallengeComplete(state, action: PayloadAction<number>) {
      const exists = state.completed.find((c) => c.id === action.payload)
      if (!exists) {
        state.completed.push({ id: action.payload, completedAt: Date.now() })
      }
    },
    resetChallenges(state) {
      state.completed = []
    },
    cleanupExpired(state) {
      state.completed = state.completed.filter((c) => !isExpired(c.completedAt))
    },
  },
})

export const { markChallengeComplete, resetChallenges, cleanupExpired } =
  challengesSlice.actions
export const selectCompletedChallengeIds = (state: ChallengesState) =>
  state.completed.filter((c) => !isExpired(c.completedAt)).map((c) => c.id)
export default challengesSlice.reducer
