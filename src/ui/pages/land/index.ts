import { N, Viewable } from '@/util/ui'
import './style.css'
import LandList from './landInfo'
import LandMap from './landMap'
import { fetchEncrypted } from '@/util/data'
import { LandDataState, LandUIEventType, LandUIState } from '../../features/land'

export const ARG_LAND_Q = 'land.q'

LandDataState.setData(JSON.parse(await fetchEncrypted('data/land.txt')))
setTimeout(() => {
  const filter = new URLSearchParams(location.search).get(ARG_LAND_Q)
  if (filter)
    LandUIState.trigger({
      type: LandUIEventType.FILTER,
      value: filter,
    })
}, 500)

class Land extends Viewable {
  constructor() {
    super()
    this.view = N('div', [LandMap, LandList], { class: 'page land' })
  }
}

export default new Land()
