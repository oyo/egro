import { addEvents, N, Viewable } from '@/util/ui'
import { dropIn, dropOut, fromText } from 'drop.that'
import { decryptData, encryptData } from '@/ui/features/data'
import './style.css'

const isEnc = (input: string) => /^[A-Za-z0-9+/]{16}\.[A-Za-z0-9+/=]+$/.exec(input)

class EncryptView extends Viewable {
  constructor() {
    super()
    this.view = addEvents(N('button', 'crypt', { class: 'encrypt-view' }), {
      click: async () => {
        const input = (await (await dropIn({ autoStart: true })).text()).trim()
        const action = isEnc(input) ? decryptData : encryptData
        await dropOut(await fromText(await action(input)), {
          clipboard: { auto: true },
        })
      },
    })
  }
}

export default new EncryptView()
