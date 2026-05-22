import { addEvents, N, Viewable } from '@/util/ui'
import { dropIn, dropOut } from 'drop.that'
import { encryptData } from '@/ui/features/data'
import './style.css'

class EncryptView extends Viewable {
  constructor() {
    super()
    this.view = addEvents(N('button', 'encrypt data', { class: 'encrypt-view' }), {
      click: async () =>
        await dropOut(await encryptData(await dropIn({ autoStart: true })), {
          autoCopy: true,
        }),
    })
  }
}

export default new EncryptView()
