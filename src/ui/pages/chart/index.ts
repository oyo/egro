import { N, Viewable } from '@/util/ui'
import chart from '@/ui/components/chartView'
import './style.css'

class Chart extends Viewable {
  constructor() {
    super()
    this.view = N('div', chart, { class: 'page account' })
  }
}

export default new Chart()
