import { formatNumber } from '../../../util/format.js'
import { type DataValue, type PaginTable } from '../../../shared/types/data.js'
import './style.css'
import { addEvents, debounce, N } from '@/util/ui.js'
import { typenameMap } from '@/shared/datautils/banking.js'

const ARG_Q = 'account:q'

const RE = {
  seq: /^#(\d{1,6}(,\d{1,6}){0,99})/,
  date: /^20[12]\d-/,
  type: new RegExp(`^(${Object.keys(typenameMap).join('|')})$`, 'i'),
  name: /^name:[-a-z. ]{1,99}$/i,
}

interface BankingMetrics {
  aavg: number
  amax: number
  amin: number
  asum: number
  bavg: number
  bmax: number
  bmin: number
  bsum: number
  len: number
}

interface BankingRow {
  seq: number
  amnt: number
  blnc: number
  date: string
  desc: string
  name: string
  type: string
}

const pageArgs = new URLSearchParams(location.search)

const filterColumns = (table: PaginTable) =>
  table.rows.map(
    (row: DataValue[]): BankingRow => ({
      seq: Number(row[0]),
      amnt: Number(row[5]),
      blnc: Number(row[6]),
      date: row[1] as string,
      desc: row[4] as string,
      name: row[2] as string,
      type: row[3] as string,
    }),
  )

const filterRows = (rows: BankingRow[], expr: string) => {
  const re = new RegExp(`(${expr})`, 'i')
  let filt: (row: BankingRow) => boolean
  if (RE.seq.exec(expr)) filt = (row) => expr.substring(1).split(',').map(Number).includes(row.seq)
  else if (RE.date.exec(expr)) filt = (row) => re.exec(row.date) !== null
  else if (RE.name.exec(expr)) {
    const vre = new RegExp(`(${expr.substring(5)})`, 'i')
    filt = (row) => vre.exec(row.name) !== null
  } else if (RE.type.exec(expr)) {
    const typere = new RegExp(`^${expr}$`, 'i')
    filt = (row) => typere.exec(row.type) !== null
  } else
    filt = (row) =>
      re.exec(row.date) !== null || re.exec(row.name) !== null || re.exec(row.desc) !== null
  return rows.filter(filt)
}

const calcMetrics = (rows: BankingRow[]): BankingMetrics => {
  const len = rows.length
  const m = rows.reduce(
    (a, c) => ({
      aavg: 0,
      amax: c.amnt > a.amax ? c.amnt : a.amax,
      amin: c.amnt < a.amin ? c.amnt : a.amin,
      asum: a.asum + c.amnt,
      bavg: 0,
      bmax: c.blnc > a.bmax ? c.blnc : a.bmax,
      bmin: c.blnc < a.bmin ? c.blnc : a.bmin,
      bsum: a.bsum + c.blnc,
      len,
    }),
    { aavg: 0, amax: -1e9, amin: 1e9, asum: 0, bavg: 0, bmax: -1e9, bmin: 1e9, bsum: 0, len },
  )
  return {
    ...m,
    aavg: m.asum / len,
    bavg: m.bsum / len,
  }
}

const renderMetrics = (m: BankingMetrics) =>
  N(
    'div',
    [
      N(
        'span',
        `Buchung( # ${m.len.toString()} · ∑ ${formatNumber(m.asum)} · Ø ${formatNumber(m.aavg)} · ⏊ ${formatNumber(m.amin)} · ⏉ ${formatNumber(m.amax)} )`,
      ),
      N(
        'span',
        `Saldo( Ø ${formatNumber(m.bavg)} · ⏊ ${formatNumber(m.bmin)} · ⏉ ${formatNumber(m.bmax)} )`,
      ),
    ],
    { class: 'metrics' },
  )

const SL = (val: string, label?: string) =>
  addEvents(N('a', label ?? val, { href: '#' }), {
    click: (e: Event) => {
      e.preventDefault()
      filterInput.value = val
      filterInput.select()
      renderFunction()
    },
  })

const render = (rows: BankingRow[]) => {
  while (tbody.lastChild) tbody.removeChild(tbody.lastChild)
  const m = calcMetrics(rows)
  metrics.replaceChildren(renderMetrics(m))
  rows
    .map((row) =>
      N('tr', [
        N('td', SL('#' + String(row.seq), String(row.seq)), { class: 'seq' }),
        N(
          'td',
          ((d) => [
            SL(`${d[0]}-`),
            SL(`${d[0]}-${d[1]}-`, `${d[1]}-`),
            SL(`${d[0]}-${d[1]}-${d[2]}`, d[2]),
          ])(row.date.split('-')),
          { class: 'date' },
        ),
        N('td', SL(row.type), { class: 'type' }),
        N('td', SL(`name:${row.name}`, row.name), { class: 'name' }),
        N('td', row.desc, { class: 'desc' }),
        N('td', formatNumber(row.amnt), { class: `amnt${row.amnt < 0 ? ' neg' : ''}` }),
        N('td', formatNumber(row.blnc), { class: `blnc${row.blnc < 0 ? ' neg' : ''}` }),
      ]),
    )
    .forEach((row: Element) => tbody.appendChild(row))
}

let dataTable: BankingRow[]
const initExpr = pageArgs.get(ARG_Q) ?? ''
const renderFunction = (skipHistory?: boolean) => {
  const expr = filterInput.value
  render(filterRows(dataTable, expr))
  if (!skipHistory) {
    if (expr.length === 0) pageArgs.delete(ARG_Q)
    else pageArgs.set(ARG_Q, expr)
    history.pushState({}, `EGRO - ${expr}`, `${location.pathname}?${pageArgs.toString()}`)
  }
}
const filterInput = addEvents(
  N('input', undefined, {
    autofocus: 'true',
    placeholder: '<filter>',
    value: initExpr,
  }),
  {
    keyup: debounce(() => {
      renderFunction()
    }, 250),
  },
) as HTMLInputElement
const filterBar = N(
  'div',
  [
    addEvents(N('button', '✖'), {
      click: () => {
        filterInput.value = ''
        renderFunction()
      },
    }),
    filterInput,
  ],
  { class: 'filterbar' },
)
const metrics = N('div')
const tbody = N('tbody')
const table = N('table', [tbody], { class: 'banking' })
const view = N('div', [filterBar, metrics, table])

if (initExpr) filterInput.select()

export function setFilterData(data: PaginTable) {
  dataTable = filterColumns(data)
  renderFunction(true)
}

export function setFilterValue(val: string) {
  filterInput.value = val
  filterInput.select()
  renderFunction(true)
}

export default view
