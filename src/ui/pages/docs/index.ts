import { N, Viewable } from '@/util/ui'
import { DocsList } from './docsList'
import './style.css'
import { FilterBar } from '@/ui/components/filterBar'
import { args } from '@/util/nav'

export const ARG_DOCS_Q = 'docs.q'

export class Docs extends Viewable {
  constructor() {
    super()
    const list = new DocsList()
    const filter = new FilterBar()
      .subscribe(list.doFilter.bind(list))
      .setFilterValue(args.get(ARG_DOCS_Q) ?? '')
    this.view = N('div', [filter, list], { class: 'page docs' })
  }
}
