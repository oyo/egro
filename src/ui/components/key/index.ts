import { addEvents, N } from '@/util/ui'
import './style.css'

const keyPrefix = 'egro_'

const readKey = (e: Event) => {
  let key = (e.target as HTMLInputElement).value
  if (key.startsWith(keyPrefix)) key = key.substring(keyPrefix.length)
  if (key.length < 22) return
  const param = new URLSearchParams(location.search)
  param.set('key', key)
  location.href = `${location.pathname}?${param.toString()}`
}

const view = addEvents(
  N(
    'div',
    N('input', undefined, {
      placeholder: 'Bitte gültigen Schlüssel eingeben',
      autofocus: '',
    }),
    {
      class: 'input-key',
    },
  ),
  {
    keyup: readKey,
    change: readKey,
  },
)

export default view
