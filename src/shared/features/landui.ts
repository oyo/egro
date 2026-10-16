import { LandState } from './land'

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

export type LandUIListener = (event: LandUIStateType) => void

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
              .filter((key) => LandState.state.keys.includes(key))
              .sort((a, b) => a.localeCompare(b))
              .join(','),
          }
        else if (LandState.state.keys.includes(event.value)) {
          pushEvent = {
            type: LandUIEventType.SELECT,
            value: event.value,
          }
        }
    }
    if (!pushEvent) return
    LandUIState.subscriber.forEach((l) => l(pushEvent))
    LandUIState.prev[event.type] = event
  },
}
