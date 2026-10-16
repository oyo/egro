import { N, Viewable } from '@/util/ui'
import ZeroMd from 'zero-md'
import { Crypt } from '@/shared/features/crypt'
import { BlogState } from '@/shared/features/blog'
import './style.css'
import { args } from '@/util/nav'

customElements.define('zero-md', ZeroMd)

export class Blog extends Viewable {
  constructor() {
    super()
    this.view = N('zero-md', [
      N('template', N('style', `.markdown-body { background-color: white; }`), {
        'data-append': '',
      }),
    ])
    BlogState.subscribe(this.blogLoaded.bind(this))
    Crypt.subscribe(BlogState.load)
  }

  blogLoaded(data: string[]) {
    this.append(
      N(
        'script',
        data
          .join('\n\n')
          .replace(/ href="\.\?([^"]{0,99})"/g, ` href=".?key=${args.get('key')}&$1"`),
        { type: 'text/markdown' },
      ),
    )
  }
}
