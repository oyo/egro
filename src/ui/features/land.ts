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

export interface LandDataListener {
  dataLoaded: (data: LandData) => void
}

const initialState: LandData = {
  coords: [],
  info: {},
  keys: [],
}

export const LandDataState = {
  state: initialState,
  subscriber: [] as LandDataListener[],

  subscribe: (listener: LandDataListener) => {
    LandDataState.subscriber = [...new Set([...LandDataState.subscriber, listener])]
  },

  setData: (data: LandData) => {
    LandDataState.state = data
    LandDataState.state.keys = Object.keys(data.info)
    LandDataState.subscriber.forEach((l) => l.dataLoaded(data))
  },
}

export const LandUIEventType: Record<string, number> = {
  FILTER: 1,
  HOVER: 2,
  SELECT: 3,
  MODE: 4,
}

export type LandUIStateType = {
  type: number
  value: string
}

export interface LandUIListener {
  notifyLand: (event: LandUIStateType) => void
}

export const LandUIState = {
  prev: {} as Record<number, LandUIStateType>,
  subscriber: [] as LandUIListener[],

  subscribe: (listener: LandUIListener) => {
    LandUIState.subscriber = [...new Set([...LandUIState.subscriber, listener])]
  },

  trigger: (event: LandUIStateType) => {
    let pushEvent: LandUIStateType = {
      ...event,
      value: '',
    }
    switch (event.type) {
      case LandUIEventType.HOVER:
      case LandUIEventType.SELECT:
        pushEvent = {
          ...event,
        }
        break
      case LandUIEventType.FILTER:
        if (event.value === '') break
        if (event.value.match(','))
          pushEvent = {
            ...event,
            value: event.value
              .split(',')
              .filter((key) => LandDataState.state.keys.includes(key))
              .sort((a, b) => a.localeCompare(b))
              .join(','),
          }
        else if (LandDataState.state.keys.includes(event.value)) {
          pushEvent = {
            type: LandUIEventType.SELECT,
            value: event.value,
          }
        }
    }
    if (!pushEvent) return
    LandUIState.subscriber.forEach((l) => l.notifyLand(pushEvent))
    LandUIState.prev[event.type] = event
  },
}
