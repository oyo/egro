import { fetchLatestStatic } from '@/util/data'
import { cryptoUtils } from '@/shared/datautils/crypto'

type CryptState = string | undefined
type KeyListener = (data: string) => void

export const Crypt = {
  state: process.env.KEY_GLOBAL as CryptState,
  subscriber: new Set<KeyListener>(),

  subscribe: (listener: KeyListener) => {
    Crypt.subscriber.add(listener)
    if (Crypt.state) listener(Crypt.state)
    return Crypt
  },

  validKey: async (userkey?: string): Promise<boolean> => {
    if (Crypt.state) return true
    if (!userkey) return false
    try {
      const upw = userkey.substring(0, 11)
      const ust = userkey.substring(11)
      const keys = await Crypt.loadKeys()
      const pkey = keys[ust]
      if (!pkey) return false
      const [uiv, ucipher] = pkey.split('.')
      const gkey = await Crypt.decrypt(upw, ust, uiv, ucipher)
      const check = await Crypt.decryptData(keys['crypt_check'], gkey)
      if (check === 'validkey') {
        Crypt.setData(gkey)
        return true
      }
    } catch (e) {
      console.error(e)
    }
    return false
  },

  loadKeys: async () => await (await fetchLatestStatic('data/keys.json')).json(),

  decrypt: async (pw: string, st: string, iv: string, cipher: string): Promise<string> => {
    const salt = Uint8Array.from(st, (c) => c.charCodeAt(0))
    const key = await cryptoUtils.deriveSecretKey(pw, salt.buffer)
    return await cryptoUtils.decryptText(key, cipher, iv)
  },

  decryptData: async (data: string, gkey?: string): Promise<string> => {
    const [pw, st] = (gkey ?? Crypt.state!).split('.')
    const [iv, cipher] = data.split('.')
    return await Crypt.decrypt(pw, st, iv, cipher)
  },

  encryptData: async (data: string): Promise<string> => {
    const [pw, st] = Crypt.state!.split('.')
    const salt = Uint8Array.from(st, (c) => c.charCodeAt(0))
    const key = await cryptoUtils.deriveSecretKey(pw, salt.buffer)
    const { cipher, iv } = await cryptoUtils.encryptText(key, data)
    return `${iv}.${cipher}`
  },

  getKey: () => Crypt.state,

  setData: (data: string) => {
    Crypt.state = data
    Crypt.subscriber.forEach((l) => l(data))
  },
}
