import { N, Viewable } from '@/util/ui'
import { DocsList } from './docsList'
import './style.css'

export class Docs extends Viewable {
  constructor() {
    super()
    this.view = N('div', [new DocsList()], { class: 'page docs' })
  }
}
