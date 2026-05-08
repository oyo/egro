import { configureStore } from '@reduxjs/toolkit'
import landSlice from './landSlice'
import navSlice from './navSlice'

export const store = configureStore({
  reducer: {
    land: landSlice,
    nav: navSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
