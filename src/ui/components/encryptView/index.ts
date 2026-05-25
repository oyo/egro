import { addEvents, N, Viewable } from '@/util/ui'
import { dropIn, dropOut } from 'drop.that'
import { decryptData, encryptData } from '@/ui/features/data'
import './style.css'

const isEnc = (input: string) => /^[A-Za-z0-9+/]{16}\.[A-Za-z0-9+/=]+$/.exec(input)

class EncryptView extends Viewable {
  constructor() {
    super()
    this.view = addEvents(N('button', 'crypt', { class: 'encrypt-view' }), {
      click: async () => {
        const input = (await dropIn({ autoStart: true })).trim()
        const action = isEnc(input) ? decryptData : encryptData
        await dropOut(await action(input), {
          autoCopy: true,
        })
      },
    })
  }
}

export default new EncryptView()
