import { addEvents, N } from '@/util/ui'
import { Crypt } from '@/shared/features/crypt'
import { args } from '@/util/nav'

const keyPrefix = 'egro_'
const keyPattern = /^(egro_)?[a-zA-Z0-9]{22}$/
import './style.css'

const keyValid = async (): Promise<boolean> =>
  new Promise((resolve) => {
    const showKeyInput = () => {
      document.body.appendChild(
        addEvents(
          N(
            'div',
            N('input', undefined, {
              placeholder: 'Bitte gültigen Schlüssel eingeben',
              autofocus: '',
            }),
            {
              class: 'key-input',
            },
          ),
          {
            keyup: readKey,
            change: readKey,
          },
        ),
      )
    }

    const readKey = (e: Event) => {
      let key = (e.target as HTMLInputElement).value
      if (key.startsWith(keyPrefix)) key = key.substring(keyPrefix.length)
      if (key.length < 22) return
      args.set('key', key)
      location.href = `${location.pathname}?${args.toString()}`
    }

    const checkKey = async (userkey: string): Promise<void> => {
      if (keyPattern.test(userkey) && (await Crypt.validKey(userkey))) resolve(true)
      else showKeyInput()
    }

    void checkKey(args.get('key') ?? '')
  })

export { keyValid }
