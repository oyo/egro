import { N, Viewable } from '@/util/ui'
import FlurTable from './flurTable'
import './style.css'

class Flur extends Viewable {
  constructor() {
    super()
    this.view = N('pre', FlurTable, { class: 'page flur' })
  }
}

export default new Flur()
