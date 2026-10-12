import { addEvents, append, clear, N, Viewable } from '@/util/ui'
import './style.css'
import {
  flstkUseEmpty,
  LandDataState,
  LandUIEventType,
  LandUIState,
  type FlstkInfo,
  type LandUIListener,
  type LandUIStateType,
} from '../../features/land'
import LandFilter from './landFilter'

class LandDetails extends Viewable {
  name: string
  use: HTMLDivElement
  constructor() {
    super()
    this.name = ''
    this.use = N('div') as HTMLDivElement
    this.view = addEvents(
      N('div', [N('div', this.name), this.use], {
        class: `land-details-item`,
      }),
      {
        mouseover: () =>
          LandUIState.trigger({
            type: LandUIEventType.HOVER,
            value: this.name,
          }),
        click: () =>
          LandUIState.trigger({
            type: LandUIEventType.SELECT,
            value: this.name,
          }),
      },
    )
  }
  show(info: FlstkInfo) {
    this.name = `${info.fs}${info.teil ? `/${info.teil} ` : ''}`
    if (!info.use) return this
    clear(this.use)
    append(
      this.use,
      N(
        'table',
        N('tbody', [
          ...Object.entries({ ...flstkUseEmpty, ...info.use })
            .slice(1)
            .map((att) =>
              N('tr', [
                N('td', att[0], { class: 'use-category' }),
                N('td', att[1], { class: 'use-value' }),
              ]),
            ),
          N(
            'tr',
            [
              N('td', 'Gesamt', { class: 'use-category' }),
              N('td', info.use.gesamt, { class: 'use-value' }),
            ],
            { class: 'use-gesamt' },
          ),
        ]),
      ),
    )
    return this
  }
}

class LandListItem extends Viewable {
  constructor(info: FlstkInfo) {
    super()
    const name = `${info.fs}${info.teil ? `/${info.teil} ` : ''}`
    this.view = addEvents(
      N('li', info, {
        class: `land-details-item ${info.et === 1 || info.et === 2 ? 'own' : 'nown'}`,
      }),
      {
        mouseover: () =>
          LandUIState.trigger({
            type: LandUIEventType.HOVER,
            value: name,
          }),
        click: () =>
          LandUIState.trigger({
            type: LandUIEventType.SELECT,
            value: name,
          }),
      },
    )
  }
}

class LandListList extends Viewable {
  constructor() {
    super()
    this.view = N('ul')
  }
}

class LandList extends Viewable implements LandUIListener {
  list: LandListList
  details: LandDetails
  constructor() {
    super()
    this.list = new LandListList()
    this.details = new LandDetails()
    this.view = N('div', [LandFilter, this.list], { class: 'land-list' })
  }
  showDetails(flstk: FlstkInfo) {
    this.remove(this.list).remove(this.details)
    if (flstk?.use) this.append(this.details.show(flstk))
  }
  addFlstk(flstk: FlstkInfo) {
    this.list.append(new LandListItem(flstk))
  }
  notifyLand(event: LandUIStateType) {
    this.showDetails(LandDataState.state.info[event.value])
  }
}

export default new LandList()
