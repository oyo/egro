import { N, Viewable } from '@/util/ui'
import { decryptData } from '@/ui/features/data'
import ZeroMd from 'zero-md'
import './style.css'

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
    const md = (
      await Promise.all(
        (
          await (await fetch('./data/blog/history.txt')).text()
        )
          .trim()
          .split('\n')
          .map(async (item) => String(await decryptData(item.split(',')[1]))),
      )
    ).join('\n\n')
    this.append(N('script', md, { type: 'text/markdown' }))
  }
}

class Home extends Viewable {
  blog: Viewable
  constructor() {
    super()
    this.blog = new Blog()
    this.view = N('div', this.blog, { class: 'page home' })
  }
}

export default new Home()
