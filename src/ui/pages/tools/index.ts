import { N, Viewable } from '@/util/ui'
import './style.css'
import EncryptView from '@/ui/components/encryptView'

class Tools extends Viewable {
  constructor() {
    super()
    this.view = N('div', EncryptView, { class: 'page tools' })
  }
}

export default new Tools()
