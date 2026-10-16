import { N, Viewable } from '@/util/ui'
import './style.css'

export class Content extends Viewable {
  constructor() {
    super()
    this.view = N('section', undefined, { class: 'content' })
  }
  show(page: Viewable) {
    this.clear().append(page)
  }
}
