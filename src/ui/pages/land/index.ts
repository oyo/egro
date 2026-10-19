import { N, Viewable } from '@/util/ui'
import './style.css'
import { LandMap } from './landMap'
import { Crypt } from '@/shared/features/crypt'
import { LandState } from '@/shared/features/land'
import { LandInfo } from './landInfo'

export const ARG_LAND_Q = 'land.q'
export const ARG_LAND_MODE = 'land.mode'
export type LandMode = 'edit' | 'view'

export class Land extends Viewable {
  constructor() {
    super()
    const map = new LandMap()
    this.view = N('div', new LandInfo(), { class: 'page land' })
    LandState.subscribe(map.landLoaded.bind(map))
    Crypt.subscribe(() => {
      map.appendTo(document.body).init().appendTo(this)
      void LandState.load()
    })
  }
}
