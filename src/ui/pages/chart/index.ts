import { N, Viewable } from '@/util/ui'
import { ChartView } from '@/ui/pages/chart/chartView'
import './style.css'

export class Chart extends Viewable {
  constructor() {
    super()
    this.view = N('div', new ChartView(), { class: 'page account' })
  }
}
