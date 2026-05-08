import { loadData } from '../features/data.js'
import table from './table/index.js'
import chart, { renderData } from './chart/index.js'
import download from './download/index.js'
import store from '../features/store.js'
import { setFilterData } from './table/index.js'
import keyInput from './key/index.js'
import { N } from '@/util/ui.js'

const param = new URLSearchParams(location.search)
const userkey = param.get('key')

if (userkey && userkey.length > 0)
  try {
    await loadData(userkey.startsWith('egro_') ? userkey.substring(5) : userkey)
  } catch (e: unknown) {
    console.error(e)
  }

let view
if (store.banking.rows.length === 0) {
  view = keyInput
} else {
  setFilterData(store.banking)
  renderData(store.banking)
  view = N('div', [table, chart, download])
}

export const app = view
