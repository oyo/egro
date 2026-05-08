import { N, Viewable } from '@/util/ui'
import './style.css'

class Home extends Viewable {
  constructor() {
    super()
    this.view = N('div', [N('h1', 'Home'), N('p', '...work in progress')], { class: 'page home' })
  }
}

export default new Home()
