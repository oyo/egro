import { createChart, LineSeries, type IChartApi } from 'lightweight-charts'
import { N, Viewable } from '@/util/ui'
import './style.css'
import type { PaginTable } from '@/shared/types/data'

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
    const lineSeries = this.chart.addSeries(LineSeries)
    lineSeries.setData(series)
    this.chart.timeScale().fitContent()
  }
}

export default new ChartView()
