import { addEvents, debounce, N, Viewable } from '@/util/ui'
import './style.css'

type FilterListener = (expr: string) => void

export class FilterBar extends Viewable {
  value: string = ''
  filterInput: HTMLInputElement
  subscriber: Array<FilterListener> = []

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
      { class: 'filter-bar' },
    )
  }

  subscribe(l: FilterListener) {
    this.subscriber = [...new Set([...this.subscriber, l])]
    if (this.value !== '') l(this.value)
    return this
  }

  setFilterValue(value: string, intern?: boolean) {
    this.filterInput.value = this.value = value
    if (!intern) {
      this.filterInput.select()
      this.filterInput.focus()
    }
    this.subscriber.forEach((l) => l(value))
    return this
  }

  setValue() {
    this.setFilterValue(this.filterInput.value, true)
  }

  clearValue() {
    this.setFilterValue('')
  }
}
