import { N, Viewable } from '@/util/ui'
import './style.css'
import table from '@/ui/components/table'
import chartButton from '@/ui/components/chartButton'
import download from '@/ui/components/download'

class Account extends Viewable {
  constructor() {
    super()
    this.view = N('div', [table, chartButton, download], { class: 'page account' })
  }
}

export default new Account()
