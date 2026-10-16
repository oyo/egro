import { N, Viewable } from '@/util/ui'
import { utcToDisplayTime } from '@/util/format'
import { Blog } from './blog'
import * as meta from '@/asset/data/meta.json'
import './style.css'

class Version extends Viewable {
  constructor() {
    super()
    this.view = N('div', `Version ${meta.version} aktualisiert ${utcToDisplayTime(meta.build)}`, {
      class: 'page home version',
    })
  }
}

export class Home extends Viewable {
  blog: Viewable
  constructor() {
    super()
    this.blog = new Blog()
    this.view = N('div', [this.blog, new Version()], { class: 'page home' })
  }
}
