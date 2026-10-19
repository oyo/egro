import { flstkUseEmpty, LandState, type FlstkInfo, type LandData } from '@/shared/features/land'
import { formatArea } from '@/util/format'
import { linkTo } from '@/util/nav'
import { addEvents, N, Viewable } from '@/util/ui'

type SortFn = (a: FlstkInfo, b: FlstkInfo) => number

const sortUseAtt = (att: string) => (a: FlstkInfo, b: FlstkInfo) =>
  (b.use ? (b.use[att] ?? 0) : 0) - (a.use ? (a.use[att] ?? 0) : 0)

const sortFS: SortFn = (a: FlstkInfo, b: FlstkInfo) =>
  a.fs < b.fs ? -1 : a.fs > b.fs ? 1 : a.teil && b.teil ? (a.teil < b.teil ? -1 : 1) : 0

let sortFnMap: Record<string, SortFn> = {
  gb: (a: FlstkInfo, b: FlstkInfo) => (a.gb ?? 0) - (b.gb ?? 0),
  fs: sortFS,
  teil: (a: FlstkInfo, b: FlstkInfo) => (a.teil ?? 0) - (b.teil ?? 0),
  et: (a: FlstkInfo, b: FlstkInfo) => (a.et ?? 0) - (b.et ?? 0),
}

sortFnMap = Object.keys(flstkUseEmpty).reduce((a, c) => ((a[c] = sortUseAtt(c)), a), sortFnMap)

type FSValue = (f: FlstkInfo) => number

const getVal: Array<FSValue> = [
  (f) => f.gb ?? 0,
  (f) => f.fs ?? 0,
  (f) => f.teil ?? 0,
  (f) => f.et ?? 0,
  (f) => f.use?.gesamt ?? 0,
  (f) => f.use?.acker ?? 0,
  (f) => f.use?.gruen ?? 0,
  (f) => f.use?.forst ?? 0,
  (f) => f.use?.garten ?? 0,
  (f) => f.use?.oed ?? 0,
  (f) => f.use?.un ?? 0,
  (f) => f.use?.wasser ?? 0,
  (f) => f.use?.weg ?? 0,
  (f) => f.use?.hof ?? 0,
  (f) => f.use?.grund ?? 0,
]

export class FlurTable extends Viewable {
  sortFn = sortFnMap.fs
  meta: HTMLTableRowElement
  constructor() {
    super()

    this.view = N(
      'table',
      [
        N('tr', [
          this.header('gb', 'gb'),
          this.header('fs', 'fs'),
          this.header('teil', 'teil'),
          this.header('et', 'et'),
          this.header('gesamt', 'gesamt'),
          this.header('acker', 'use'),
          this.header('gruen', 'use'),
          this.header('forst', 'use'),
          this.header('garten', 'use'),
          this.header('oed', 'use'),
          this.header('un', 'use'),
          this.header('wasser', 'use'),
          this.header('weg', 'use'),
          this.header('hof', 'use'),
          this.header('grund', 'use'),
        ]),
        (this.meta = N(
          'tr',
          Array.from({ length: 15 }).map(
            (_, i) => N('td', '', { class: i > 4 ? 'flur-use' : 'flur-gesamt' }),
            { class: 'flur-meta' },
          ),
        ) as HTMLTableRowElement),
      ],
      { class: 'flur-table' },
    )
    LandState.subscribe(this.landLoaded.bind(this))
  }

  header(att: string, sclass: string) {
    return addEvents(N('th', att, { class: `flur-${sclass}` }), {
      click: () => {
        this.sortFn = sortFnMap[att]
        this.landLoaded(LandState.state)
      },
    })
  }

  clearRows() {
    while (this.view.childNodes.length > 2) this.view.removeChild(this.view.lastChild!)
    return this
  }

  landLoaded(data: LandData) {
    const a = formatArea
    this.clearRows().append(
      Object.values(data.info)
        .filter((f) => f.gb)
        .sort(this.sortFn)
        .map((f) =>
          addEvents(
            N('tr', [
              N('td', f.gb, { class: 'flur-gb' }),
              N('td', f.fs, { class: 'flur-fs' }),
              N('td', f.teil, { class: 'flur-teil' }),
              N('td', f.et, { class: 'flur-et' }),
              N('td', a(f.use?.gesamt), { class: 'flur-gesamt' }),
              N('td', a(f.use?.acker), { class: 'flur-use' }),
              N('td', a(f.use?.gruen), { class: 'flur-use' }),
              N('td', a(f.use?.forst), { class: 'flur-use' }),
              N('td', a(f.use?.garten), { class: 'flur-use' }),
              N('td', a(f.use?.oed), { class: 'flur-use' }),
              N('td', a(f.use?.un), { class: 'flur-use' }),
              N('td', a(f.use?.wasser), { class: 'flur-use' }),
              N('td', a(f.use?.weg), { class: 'flur-use' }),
              N('td', a(f.use?.hof), { class: 'flur-use' }),
              N('td', a(f.use?.grund), { class: 'flur-use' }),
            ]),
            {
              click: () =>
                (location.href = linkTo({
                  page: 'land',
                  'land.q': `${f.fs}${f.teil ? '/' + f.teil : ''}`,
                })),
            },
          ),
        ),
    )
    const meta = Object.values(data.info)
      .filter((f) => f.gb)
      .reduce(
        (a, c) => {
          getVal.forEach((v, j) => (a[j] += v(c)))
          return a
        },
        Array.from({ length: getVal.length }).fill(0) as number[],
      )
    meta.forEach(
      ((v: number, i: number) =>
        i > 3 ? (this.meta.childNodes.item(i).firstChild!.textContent = formatArea(v)) : 0).bind(
        this,
      ),
    )
  }
}
