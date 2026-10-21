import { addEvents, N, Viewable } from '@/util/ui'
import './style.css'
import { flstkUseEmpty, LandState, type FlstkInfo } from '@/shared/features/land'
import { LandFilter } from './landFilter'
import { formatArea } from '@/util/format'
import { LandUIEventType, LandUIState, type LandUIStateType } from '@/shared/features/landui'

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
    if (!info) return this
    this.name = `${info.fs}${info.teil ? `/${info.teil}` : ''}`
    this.clear().append(
      N('tbody', [
        N('tr', [N('td', 'Flstk.-Nr.'), N('td', this.name, { class: 'flstk-name' })], {
          class: 'flstk-info',
        }),
        ...(info.use
          ? [
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
            ]
          : []),
      ]),
    )
    return this
  }
}

export class LandInfo extends Viewable {
  details: LandDetails

  constructor() {
    super()
    this.details = new LandDetails()
    this.view = N('div', [new LandFilter(), this.details], { class: 'land-info' })
    LandUIState.subscribe(this.notifyEvent.bind(this))
  }

  showDetails(flstk: FlstkInfo) {
    this.append(this.details.show(flstk))
  }

  notifyEvent(event: LandUIStateType) {
    this.remove(this.details)
    if (!event.value.includes(',')) this.showDetails(LandState.state.info[event.value])
  }
}
