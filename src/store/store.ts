import { configureStore } from "@reduxjs/toolkit"
import navigationReducer from "./features/navigationSlice"
import profileReducer from "./slices/profileSlice"
import challengesReducer from "./slices/challengesSlice"

export const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    profile: profileReducer,
    challenges: challengesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
