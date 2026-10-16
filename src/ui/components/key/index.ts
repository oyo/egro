import { addEvents, N } from '@/util/ui'
import { Crypt } from '@/shared/features/crypt'
import './style.css'

const keyPrefix = 'egro_'
const keyPattern = /^(egro_)?[a-zA-Z0-9]{22}$/

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
      const param = new URLSearchParams(location.search)
      param.set('key', key)
      location.href = `${location.pathname}?${param.toString()}`
    }

    const validateKey = async (userkey: string): Promise<void> => {
      const valid = await Crypt.validKey(userkey)
      if (!valid) showKeyInput()
      resolve(true)
    }

    const param = new URLSearchParams(location.search)
    const userkey = param.get('key')
    if (!(userkey && keyPattern.test(userkey))) {
      showKeyInput()
    } else {
      void validateKey(userkey)
    }
  })

export { keyValid }
