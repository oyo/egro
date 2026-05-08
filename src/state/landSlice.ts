import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
export type FlstkUse = {
  gesamt: number
  acker: number
  gruen: number
  forst: number
  garten: number
  oed: number
  un: number
  wasser: number
  weg: number
  hof: number
  grund: number
}

export type FlstkInfo = {
  fs: number
  teil?: number
  gb?: number
  et?: number
  use?: FlstkUse
  geo?: number[]
}

export type FlstkType = {
  coords: [number, number][]
  info: Record<string, FlstkInfo>
}

export interface LandState {
  flstk: FlstkType
}

const initialState: LandState = {
  flstk: { coords: [], info: {} },
}

export const slice = createSlice({
  name: 'land',
  initialState,
  reducers: {
    setLand: (state, action: PayloadAction<FlstkType>) => {
      state.flstk = action.payload
    },
  },
})

export const { setLand } = slice.actions

export default slice.reducer
