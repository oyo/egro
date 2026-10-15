import Nav from './nav'
import Main from './main'
import { N, Viewable } from '@/util/ui'
import './style.css'
import { loadData, storeData } from '@/ui/features/data'
import store from '@/ui/features/store'
import keyInput from '@/ui/components/key/index.js'
import { setFilterData } from '@/ui/components/table'
import { renderData } from '@/ui/components/chartButton'
import './style.css'
import chartView from './components/chartView'
import { LandDataState, LandUIEventType, LandUIState } from './features/land'
import { fetchEncrypted } from '@/util/data'
import { ARG_LAND_Q } from './pages/land'

const param = new URLSearchParams(location.search)
const userkey = param.get('key')

if (userkey && userkey.length > 0)
  try {
    storeData(await loadData(userkey.startsWith('egro_') ? userkey.substring(5) : userkey))
  } catch (e: unknown) {
    console.error(e)
  }

let view: HTMLDivElement
if (store.banking.rows.length === 0) {
  view = keyInput as HTMLDivElement
} else {
  setFilterData(store.banking)
  renderData(store.banking)
  await chartView.setData(store.banking)
  view = N('div', [Nav, Main], { class: 'app' }) as HTMLDivElement
}

LandDataState.setData(JSON.parse(await fetchEncrypted('data/land.txt')))
setTimeout(() => {
  const filter = new URLSearchParams(location.search).get(ARG_LAND_Q)
  if (filter)
    LandUIState.trigger({
      type: LandUIEventType.FILTER,
      value: filter,
    })
}, 500)

class App extends Viewable {
  constructor() {
    super()
    this.view = view
  }
}

export default new App()
