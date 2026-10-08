import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
export type FlstkUse = {
  gesamt: number
  acker?: number
  gruen?: number
  forst?: number
  garten?: number
  oed?: number
  un?: number
  wasser?: number
  weg?: number
  hof?: number
  grund?: number
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

export const flstkUseEmpty = {
  gesamt: 0,
  acker: 0,
  gruen: 0,
  forst: 0,
  garten: 0,
  oed: 0,
  un: 0,
  wasser: 0,
  weg: 0,
  hof: 0,
  grund: 0,
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
