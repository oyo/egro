import { Crypt } from '@/shared/features/crypt'
import { DocsState, type DocsData } from '@/shared/features/docs'
import { args } from '@/util/nav'
import { N, Viewable } from '@/util/ui'
import { ARG_DOCS_Q } from '.'

export class DocsList extends Viewable {
  docs: DocsData[] = []
  search: string[] = []
  filter: string[] = []
  constructor() {
    super()
    this.view = N('ul', undefined, { class: 'docs-list' })
    DocsState.subscribe(this.docsLoaded.bind(this))
    Crypt.subscribe(DocsState.load)
  }

  groupByYear(data: DocsData[]): Record<string, DocsData[]> {
    return data.reduce(
      (a, c) => {
        const y = `20${c[0].substring(0, 2)}`
        ;(a[y] = a[y] || []).push(c)
        return a
      },
      {} as Record<string, DocsData[]>,
    )
  }

  renderYear(year: string, docs: DocsData[]) {
    return N(
      'ul',
      [
        N('li', year, { class: 'docs-year' }),
        ...docs.map((d: DocsData) =>
          N(
            'li',
            N(
              'a',
              [N('span', d[2], { class: 'docs-from' }), N('span', d[3], { class: 'docs-link' })],
              {
                href: `https://drive.google.com/file/d/${d[1]}/view`,
                target: d[1],
              },
            ),
            { class: 'docs-item' },
          ),
        ),
      ],
      { class: 'docs-group' },
    )
  }

  render(docs: DocsData[]) {
    const group = this.groupByYear(docs)
    this.clear().append(
      N(
        'li',
        Object.entries(group)
          .reverse()
          .map(([y, d]) => this.renderYear(y, d)),
      ),
    )
  }

  docsLoaded(docs: DocsData[]) {
    this.docs = [...docs]
    this.search = docs.map(
      (d) => `20${d[0].substring(0, 2)} ${d.slice(2).join(' ').toLocaleLowerCase()}`,
    )
    this.doFilter()
  }

  doFilter(value?: string) {
    if (value !== undefined) {
      const raw = value.trim()
      const filter = raw
        .toLocaleLowerCase()
        .split(/\s+/g)
        .filter((t) => t.length > 0)
      if (filter !== this.filter) {
        this.filter = filter
        if (raw === '') args.delete(ARG_DOCS_Q)
        else args.set(ARG_DOCS_Q, raw)
        history.pushState({}, `EGRO - ${raw}`, `${location.pathname}?${args.toString()}`)
      }
    }
    if (this.filter.length === 0) return this.render(this.docs)
    this.render(
      this.docs.filter((_, i: number) =>
        this.filter.reduce((a: boolean, c: string) => a && this.search[i].includes(c), true),
      ),
    )
  }
}
