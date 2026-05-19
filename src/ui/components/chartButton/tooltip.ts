import { formatNumber } from '../../../util/format'
import type { CandlestickEntry } from '.'
import { N } from '@/util/ui'

const valRow = (label: string, value?: number) =>
  N('div', [
    N('span', label, { class: 'chart-tooltip-head' }),
    N('span', formatNumber(value ?? 0), { class: 'chart-tooltip-val' }),
  ])

const dummy = N('div')
const diff = valRow('y')
const begin = valRow('⊢')
const end = valRow('⊣')
const min = valRow('⊥')
const max = valRow('⊤')
const view = N('div', [diff, begin, end, min, max], { class: 'chart-tooltip' }) as HTMLDivElement

export const showTooltip = (data: CandlestickEntry) => {
  view.style.display = 'block'
  ;(diff.firstChild ?? dummy).textContent = data.key.toString()
  ;(diff.lastChild ?? dummy).textContent = formatNumber(1000 * (data.end - data.begin))
  ;(begin.lastChild ?? dummy).textContent = formatNumber(1000 * data.begin)
  ;(end.lastChild ?? dummy).textContent = formatNumber(1000 * data.end)
  ;(min.lastChild ?? dummy).textContent = formatNumber(1000 * data.min)
  ;(max.lastChild ?? dummy).textContent = formatNumber(1000 * data.max)
}

export const hideTooltip = () => (view.style.display = 'none')

export default view
