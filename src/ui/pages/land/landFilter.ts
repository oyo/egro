import {
  LandUIEventType,
  LandUIState,
  type LandUIListener,
  type LandUIStateType,
} from '@/ui/features/land'
import { addEvents, debounce, N, Viewable } from '@/util/ui'

class LandFilter extends Viewable implements LandUIListener {
  filterInput: HTMLInputElement
  selectInputText: boolean = true

  constructor() {
    super()
    this.filterInput = addEvents(
      N('input', undefined, {
        autofocus: 'true',
        placeholder: '<filter>',
        value: '',
      }),
      {
        keyup: debounce(this.setValue.bind(this), 250),
      },
    ) as HTMLInputElement
    this.view = N(
      'div',
      [
        addEvents(N('button', '✖'), {
          click: this.clearValue.bind(this),
        }),
        this.filterInput,
      ],
      { class: 'land-filterbar' },
    )
    LandUIState.subscribe(this)
  }

  notifyLand(event: LandUIStateType) {
    if (event.type === LandUIEventType.HOVER) return
    if (!this.selectInputText) {
      this.selectInputText = true
      return
    }
    this.filterInput.value = event.value
    this.filterInput.focus()
    this.filterInput.select()
  }

  setFilterValue(value: string) {
    this.filterInput.value = value
    LandUIState.trigger({
      type: LandUIEventType.FILTER,
      value,
    })
  }

  setValue() {
    this.selectInputText = false
    this.setFilterValue(this.filterInput.value)
  }

  clearValue() {
    this.setFilterValue('')
  }
}

export default new LandFilter()
