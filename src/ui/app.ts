import { N, Viewable } from '@/util/ui'
import { Nav } from './components/nav'
import { Content } from './components/content'
import './style.css'

export class App extends Viewable {
  constructor() {
    super()
    const content = new Content()
    this.view = N('div', [new Nav(content), content], { class: 'app' })
  }
}
