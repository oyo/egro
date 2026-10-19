import { fetchEncrypted } from '@/util/data'

export type FlstkUse = Record<string, number>

export type FlstkInfo = {
  fs: number
  teil?: number
  gb?: number
  et?: number
  use?: FlstkUse
  geo?: number[]
}

export type LandData = {
  coords: [number, number][]
  info: Record<string, FlstkInfo>
  keys: string[]
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

export type LandListener = (data: LandData) => void

const initialState: LandData = {
  coords: [],
  info: {},
  keys: [],
}

export const LandState = {
  state: initialState,
  subscriber: [] as LandListener[],

  subscribe: (listener: LandListener) => {
    LandState.subscriber = [...new Set([...LandState.subscriber, listener])]
    if (LandState.hasData()) listener(LandState.state)
    return LandState
  },

  setData: (data: LandData) => {
    LandState.state = data
    LandState.state.keys = Object.keys(data.info)
    LandState.subscriber.forEach((l) => l(data))
  },

  hasData: () => LandState.state.keys.length > 0,

  fetch: async () => JSON.parse(await fetchEncrypted('data/land.txt')),

  load: async () => (LandState.hasData() ? undefined : LandState.setData(await LandState.fetch())),
}
