import type { PaginTable } from '@/shared/types/data'
import './style.css'
import tooltip, { hideTooltip, showTooltip } from './tooltip'
import { N } from '@/util/ui'

export type CandlestickEntry = {
  key: number
  begin: number
  end: number
  min: number
  max: number
}

const XD = 32

const renderChart = (
  data: CandlestickEntry[],
) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -40 500 510">
  <defs><style>.t,.s{fill:#aaaaaa;stroke:#aaaaaa;font-size:10px;stroke-width:0.3;}.a{stroke:#888888;stroke-width:1;}.p{fill:none;stroke:#008800;stroke-width:3;}.n{fill:none;stroke:#ff8800;stroke-width:3;}.p:hover,.n:hover{stroke-width:6;}</style></defs>
  ${data.map((_, i) => `<text class="t" x="${i * XD + 42}" y="425">${16 + i}</text>`).join('')}${[
    1, 2, 3,
  ]
    .map(
      (s) =>
        `<path class="s" d="M 40 ${400 - s * 100} l 360 0"></path><text class="s" x="0" y="${403 - s * 100}" >${s * 100}k</text>`,
    )
    .join(
      '',
    )}<g transform="translate(0,400)scale(1,-1)"><path class="a" d="M 0 0 l 400 0"></path><g transform="translate(50,0)">${data
    .map(
      (y, i) =>
        `<path id="chart-${y.key}" value="${JSON.stringify(y).replaceAll(
          '"',
          '|',
        )}" class="bar ${y.begin > y.end ? 'n' : 'p'}" d="M ${i * XD} ${y.min} l 0 ${y.max - y.min} M ${i * XD - 10} ${y.begin} l 10 0 M ${i * XD} ${y.end} l 10 0"></path>
`,
    )
    .join('')}</g></g></svg>`

const aggregate = (keys: number[], data: number[][]): CandlestickEntry[] => {
  const a = keys.map((key) => {
    const dk = data.filter((r) => r[0] === key)
    const begin = dk[0][2]
    const end = dk[dk.length - 1][2]
    const values = dk.map((v) => v[2])
    const min = Math.min(...values)
    const max = Math.max(...values)
    return {
      key,
      begin,
      end,
      min,
      max,
    }
  })
  return a
}

const prepareData = (data: number[][]) =>
  aggregate(
    [...data.reduce((a, o) => a.add(o[0]), new Set<number>())].sort((a, b) => a - b),
    data,
  )

const chart = N('div', undefined, { class: 'chart-button-graph' })
const view = N('div', [chart, tooltip], { class: 'chart-button' })

export const renderData = (data: PaginTable) => {
  chart.innerHTML = renderChart(
    prepareData(
      data.rows.reverse().map((r) => [
        ...(r[1] as string)
          .split('-')
          .slice(0, 2)
          .map((n) => Number(n)),
        Number(r[6]) / 1000,
      ]),
    ),
  )
  setTimeout(
    () =>
      [...document.getElementsByClassName('bar')].forEach((b) => {
        b.addEventListener('mouseover', (e) =>
          showTooltip(
            JSON.parse(
              ((e.target! as SVGPathElement).getAttribute('value') ?? '').replaceAll('|', '"'),
            ),
          ),
        )
        b.addEventListener('mouseout', hideTooltip)
      }),
    200,
  )
}

export default view
