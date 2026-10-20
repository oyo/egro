import { Crypt } from '@/shared/features/crypt'
import { DocsState, type DocsData } from '@/shared/features/docs'
import { formatDateYM } from '@/util/format'
import { N, Viewable } from '@/util/ui'

export class DocsList extends Viewable {
  constructor() {
    super()
    this.view = N('ul', N('li', 'docs'), { class: 'docs-list' })
    DocsState.subscribe(this.docsLoaded.bind(this))
    Crypt.subscribe(DocsState.load)
  }

  docsLoaded(docs: DocsData[]) {
    this.clear().append(
      Object.values(docs).map((d: DocsData) =>
        N(
          'li',
          N(
            'a',
            [
              N('span', formatDateYM(Number(d[0])), { class: 'docs-date' }),
              N('span', d[3], { class: 'docs-link' }),
              N('span', d[2], { class: 'docs-from' }),
            ],
            {
              href: `https://drive.google.com/file/d/${d[1]}/view`,
              target: 'docs',
            },
          ),
          { class: 'docs-item' },
        ),
      ),
    )
  }
}
