import { BaselineSeries, createChart, type IChartApi } from 'lightweight-charts'
import { N, Viewable } from '@/util/ui'
import './style.css'
import type { PaginTable } from '@/shared/types/data'
import { setFilterValue } from '../table'
import { store } from '@/state/store'
import { selectPage, type NavOption } from '@/state/navSlice'

class ChartView extends Viewable {
  chart: IChartApi

  constructor() {
    super()
    this.view = N('div', undefined, { class: 'chart-view' })
    const dim = {
      width: window.innerWidth * 0.96,
      height: window.innerHeight,
    }
    this.chart = createChart(this.view as HTMLElement, dim)
    this.chart.subscribeClick((param) => {
      if (!param.point || !param.time) return
      setFilterValue(param.time as string)
      store.dispatch(selectPage('account' as NavOption))
    })
  }

  setData(data: PaginTable) {
    const series = [{ time: '2016-10-01', value: 0 }].concat(
      Object.values(
        data.rows
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
  }
}

export default new ChartView()
