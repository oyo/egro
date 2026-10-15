import {
  LandDataState,
  type FlstkInfo,
  type LandData,
  type LandDataListener,
} from '@/ui/features/land'
import { formatArea } from '@/util/format'
import { linkTo } from '@/util/nav'
import { addEvents, N, Viewable } from '@/util/ui'

class FlurTable extends Viewable implements LandDataListener {
  constructor() {
    super()
    this.view = N('table', undefined, { class: 'flur-table' })
    LandDataState.subscribe(this)
  }
  dataLoaded(data: LandData) {
    const a = formatArea
    this.append([
      N('tr', [
        N('th', 'gb', { class: 'flur-gb' }),
        N('th', 'fs', { class: 'flur-fs' }),
        N('th', 'teil', { class: 'flur-teil' }),
        N('th', 'et', { class: 'flur-et' }),
        N('th', 'fläche', { class: 'flur-gesamt' }),
        N('th', 'acker', { class: 'flur-use' }),
        N('th', 'gruen', { class: 'flur-use' }),
        N('th', 'forst', { class: 'flur-use' }),
        N('th', 'garten', { class: 'flur-use' }),
        N('th', 'oed', { class: 'flur-use' }),
        N('th', 'un', { class: 'flur-use' }),
        N('th', 'wasser', { class: 'flur-use' }),
        N('th', 'weg', { class: 'flur-use' }),
        N('th', 'hof', { class: 'flur-use' }),
        N('th', 'grund', { class: 'flur-use' }),
      ]),
      ...Object.values(data.info)
        .sort((a: FlstkInfo, b: FlstkInfo) =>
          a.fs < b.fs ? -1 : a.fs > b.fs ? 1 : a.teil && b.teil ? (a.teil < b.teil ? -1 : 1) : 0,
        )
        .filter((f) => f.gb)
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
    ])
  }
}

export default new FlurTable()
