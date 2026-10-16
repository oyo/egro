import { N, Viewable } from '@/util/ui'
import './style.css'
import table, { setFilterData } from './accountTable'
import downloadButton, { setDownloadData } from './downloadView'
import chartButton, { setChartData } from './chartButton'
import { Crypt } from '@/shared/features/crypt'
import { AccountState } from '@/shared/features/account'
import { BankingAttributes } from '@/shared/types/banking'
import { defaultPaginMeta } from '@/shared/types/data'

export class Account extends Viewable {
  constructor() {
    super()
    this.view = N('div', [table, chartButton, downloadButton], { class: 'page account' })
    AccountState.subscribe((rows) => {
      const table = {
        headers: BankingAttributes,
        meta: defaultPaginMeta,
        rows,
      }
      setFilterData(table)
      setDownloadData(table)
      setChartData(table)
    })
    Crypt.subscribe(AccountState.load)
  }
}
