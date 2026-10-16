import { N, Viewable } from '@/util/ui'
import './style.css'
import { FlurTable } from './flurTable'

export class Flur extends Viewable {
  constructor() {
    super()
    this.view = N('pre', new FlurTable(), { class: 'page flur' })
  }
}

export default new Flur()
