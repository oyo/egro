import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type NavOption = 'home' | 'account' | 'chart' | 'land' //| 'tools'

export interface NavState {
  selected: string
}

const initialState: NavState = {
  selected: 'home',
}

export const slice = createSlice({
  name: 'nav',
  initialState,
  reducers: {
    selectPage: (state, action: PayloadAction<NavOption>) => {
      state.selected = action.payload
    },
  },
})

export const { selectPage } = slice.actions

export default slice.reducer
