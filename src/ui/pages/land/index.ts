import { N, Viewable } from '@/util/ui'
import './style.css'
import LandList from './landList'
import LandMap from './landMap'
import { setLand } from '@/state/landSlice'
import { store } from '@/state/store'

export const LandUIEventType = {
  FILTER: 1,
  HOVER: 2,
  SELECT: 3,
}

export type LandUIStateType = {
  type: number
  value: string
  prevValue?: string
}

export interface LandUIListener {
  notifyLand: (event: LandUIStateType) => void
}

export const LandUIState = {
  prev: [] as (string | undefined)[],
  subscriber: [LandList, LandMap],
  action: (event: LandUIStateType) => {
    const pushEvent = {
      ...event,
      prevValue: LandUIState.prev[event.type],
    }
    LandUIState.subscriber.forEach((l) => l.notifyLand(pushEvent))
    LandUIState.prev[event.type] = event.value
  },
}

store.dispatch(setLand(await (await fetch('data/land.json')).json()))

class Land extends Viewable {
  constructor() {
    super()
    this.view = N('div', [LandMap, LandList], { class: 'page land' })
  }
}

export default new Land()
