import { BaselineSeries, createChart, type IChartApi } from 'lightweight-charts'
import { N, Viewable } from '@/util/ui'
import tb from '@/asset/data/tb.txt?raw'
import './style.css'
import { NavState } from '@/shared/features/nav'
import { Crypt } from '@/shared/features/crypt'
import { setFilterValue } from '@/ui/pages/account/accountTable'
import { AccountState } from '@/shared/features/account'

export class ChartView extends Viewable {
  chart?: IChartApi
  rows: string[][] = []

  constructor() {
    super()
    this.view = N('div', undefined, { class: 'chart-view' })
    AccountState.subscribe(this.setData.bind(this))
    Crypt.subscribe(AccountState.load)
  }

  async setData(rows: string[][]) {
    if (rows) this.rows = rows
    this.clear()
    const dim = {
      width: window.innerWidth * 0.96,
      height: window.innerHeight,
    }
    this.chart = createChart(this.view as HTMLElement, dim)
    this.chart.subscribeClick((param) => {
      if (!param.point || !param.time) return
      setFilterValue(param.time as string)
      NavState.setPage('account')
    })
    const today = new Date().toISOString().substring(0, 10)
    const seriesWP = (await Crypt.decryptData(tb.trim()))
      .split('\n')
      .map((r) => r.split(','))
      .map((r) => ({ time: r[0], value: Number(r[1]) }))
    const lastItem = seriesWP[seriesWP.length - 1]
    if (lastItem.time !== today)
      seriesWP.push({
        time: today,
        value: lastItem.value,
      })
    const chartSeriesWP = this.chart.addSeries(BaselineSeries, {
      baseLineColor: 'white',
      topFillColor1: 'rgb(176, 176, 176)',
      topFillColor2: 'rgba(176, 176, 176, 0.2)',
      bottomFillColor1: 'orange',
      bottomFillColor2: 'rgba(255, 165, 0, 0.2)',
      topLineColor: '#b0b0b0',
      bottomLineColor: 'orange',
      lineWidth: 2,
    })
    chartSeriesWP.setData(seriesWP)
    const series = [{ time: '2016-10-01', value: 0 }].concat(
      Object.values(
        this.rows
          .map((r) => ({
            time: r[1] as string,
            value: Number(r[6]),
          }))
          .sort((a, b) => a.time.localeCompare(b.time))
          .reduce(
            (a, c) => {
              a[c.time] = c
              return a
            },
            {} as Record<string, { time: string; value: number }>,
          ),
      ),
    )
    const chartSeries = this.chart.addSeries(BaselineSeries, {
      baseLineColor: 'white',
      topFillColor1: '#00b000',
      topFillColor2: 'rgba(0, 176, 0, 0.2)',
      bottomFillColor1: 'orange',
      bottomFillColor2: 'rgba(255, 165, 0, 0.2)',
      topLineColor: '#00b000',
      bottomLineColor: 'orange',
      lineWidth: 2,
    })
    chartSeries.setData(series)
    this.chart.timeScale().fitContent()
    window.addEventListener('resize', (_e: Event) => {
      const dim = {
        width: window.innerWidth * 0.96,
        height: window.innerHeight,
      }
      this.chart?.resize(dim.width, dim.height)
    })
  }
}
