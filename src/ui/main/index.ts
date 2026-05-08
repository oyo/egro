import { N, Viewable } from '@/util/ui'
import './style.css'

class MainSingle extends Viewable {
  constructor() {
    super()
    this.view = N('section', undefined, { class: 'main' })
  }
  show(page: Viewable) {
    this.clear().append(page)
  }
}

export default new MainSingle()
