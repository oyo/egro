import { addEvents, append, clear, N, Viewable } from '@/util/ui'
import './style.css'
import { type FlstkInfo } from '@/state/landSlice'
import { store } from '@/state/store'
import { LandUIEventType, LandUIState, type LandUIListener, type LandUIStateType } from '.'

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
          LandUIState.action({
            type: LandUIEventType.HOVER,
            value: this.name,
          }),
        click: () =>
          LandUIState.action({
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
          ...Object.entries(info.use)
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
          LandUIState.action({
            type: LandUIEventType.HOVER,
            value: name,
          }),
        click: () =>
          LandUIState.action({
            type: LandUIEventType.SELECT,
            value: name,
          }),
      },
    )
  }
}

class LandListFilter extends Viewable {
  constructor() {
    super()
    this.view = N('input')
  }
}

class LandListList extends Viewable {
  constructor() {
    super()
    this.view = N('ul')
  }
}

class LandList extends Viewable implements LandUIListener {
  filter: LandListFilter
  list: LandListList
  details: LandDetails
  constructor() {
    super()
    this.filter = new LandListFilter()
    this.list = new LandListList()
    this.details = new LandDetails()
    this.view = N('div', [this.filter, this.list], { class: 'land-list' })
  }
  showDetails(flstk: FlstkInfo) {
    this.remove(this.list).remove(this.details)
    if (flstk?.use) this.append(this.details.show(flstk))
  }
  addFlstk(flstk: FlstkInfo) {
    this.list.append(new LandListItem(flstk))
  }
  notifyLand(event: LandUIStateType) {
    ;(this.filter.getView() as HTMLInputElement).value = event.value
    this.showDetails(store.getState().land.flstk.info[event.value])
  }
}

const theLandList = new LandList()
store.subscribe(() => {
  theLandList.list.clear()
  //const flstk = store.getState().land.flstk
  //Object.values(flstk.info).forEach(theLandList.addFlstk.bind(theLandList))
})

export default theLandList
