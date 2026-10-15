import { addEvents, N, Viewable } from '@/util/ui'
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
import { formatArea } from '@/util/format'

class LandDetails extends Viewable {
  name: string
  constructor() {
    super()
    this.name = ''
    this.view = addEvents(
      N('table', undefined, {
        class: `land-details-item`,
      }),
      {
        click: (() => {
          console.log(this.name)
          LandUIState.trigger({
            type: LandUIEventType.SELECT,
            value: this.name,
          })
        }).bind(this),
      },
    )
  }

  show(info: FlstkInfo) {
    this.name = `${info.fs}${info.teil ? `/${info.teil}` : ''}`
    if (!info.use) return this
    this.clear().append(
      N('tbody', [
        N('tr', [N('td', 'Flstk.-Nr.'), N('td', this.name, { class: 'flstk-name' })], {
          class: 'flstk-info',
        }),
        ...Object.entries({ ...flstkUseEmpty, ...info.use })
          .slice(1)
          .map((att) =>
            N('tr', [
              N('td', att[0], { class: 'use-category' }),
              N('td', formatArea(att[1]), { class: 'use-value' }),
            ]),
          ),
        N(
          'tr',
          [
            N('td', 'Gesamt', { class: 'use-category' }),
            N('td', formatArea(info.use.gesamt), { class: 'use-value' }),
          ],
          { class: 'use-gesamt' },
        ),
      ]),
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

class LandList extends Viewable {
  constructor() {
    super()
    this.view = N('ul')
  }
}

class LandInfo extends Viewable implements LandUIListener {
  list: LandList
  details: LandDetails
  constructor() {
    super()
    this.list = new LandList()
    this.details = new LandDetails()
    this.view = N('div', [LandFilter, this.details], { class: 'land-info' })
    LandUIState.subscribe(this)
  }
  showDetails(flstk: FlstkInfo) {
    if (flstk?.use) this.append(this.details.show(flstk))
  }
  addFlstk(flstk: FlstkInfo) {
    this.list.append(new LandListItem(flstk))
  }
  notifyLand(event: LandUIStateType) {
    this.remove(this.list).remove(this.details)
    if (!event.value.includes(',')) this.showDetails(LandDataState.state.info[event.value])
  }
}

export default new LandInfo()
