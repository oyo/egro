import { N, Viewable } from '@/util/ui'
import './style.css'
import LandList from './landInfo'
import LandMap from './landMap'

export const ARG_LAND_Q = 'land.q'
export const ARG_LAND_MODE = 'land.mode'
export type LandMode = 'edit' | 'view'

class Land extends Viewable {
  constructor() {
    super()
    this.view = N('div', [LandMap, LandList], { class: 'page land' })
  }
}

export default new Land()
