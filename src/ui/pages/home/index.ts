import { N, Viewable } from '@/util/ui'
import { decryptData } from '@/ui/features/data'
import ZeroMd from 'zero-md'
import * as meta from '@/asset/data/meta.json'
import './style.css'
import { fetchLatestStatic } from '@/util/data'
import { utcToDisplayTime } from '@/util/format'

customElements.define('zero-md', ZeroMd)

class Blog extends Viewable {
  constructor() {
    super()
    this.view = N('zero-md', [
      N('template', N('style', `.markdown-body { background-color: white; }`), {
        'data-append': '',
      }),
    ])
    void this.loadContent()
  }
  async loadContent() {
    const key = new URLSearchParams(location.search).get('key') ?? ''
    const md = (
      await Promise.all(
        (
          await (await fetchLatestStatic('data/blog/history.txt')).text()
        )
          .trim()
          .split('\n')
          .map(async (item) => await decryptData(item.split(',')[1])),
      )
    )
      .join('\n\n')
      .replace(/ href="\.\?([^"]{0,99})"/g, ` href=".?key=${key}&$1"`)
    this.append(N('script', md, { type: 'text/markdown' }))
  }
}

class Version extends Viewable {
  constructor() {
    super()
    this.view = N('div', `Version ${meta.version} aktualisiert ${utcToDisplayTime(meta.build)}`, {
      class: 'page home version',
    })
  }
}

class Home extends Viewable {
  blog: Viewable
  constructor() {
    super()
    this.blog = new Blog()
    this.view = N('div', [this.blog, new Version()], { class: 'page home' })
  }
}

export default new Home()
