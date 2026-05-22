import { cryptoUtils } from '../../shared/datautils/crypto.js'
import { BankingAttributes } from '../../shared/types/banking.js'
import { defaultPaginMeta } from '../../shared/types/data.js'
import store from './store.js'

const decrypt = async (pw: string, st: string, iv: string, cipher: string): Promise<string> => {
  const salt = Uint8Array.from(st, (c) => c.charCodeAt(0))
  const key = await cryptoUtils.deriveSecretKey(pw, salt.buffer)
  return await cryptoUtils.decryptText(key, cipher, iv)
}

export const decryptData = async (data: string, mkey?: string): Promise<string> => {
  const [pw, st] = (mkey ?? (await getKey())).split('.')
  const [iv, cipher] = data.split('.')
  return await decrypt(pw, st, iv, cipher)
}

export const loadDatafile = async (name: string, mkey?: string): Promise<string> => {
  const response = await fetch(name)
  const data = await response.text()
  return await decryptData(data, mkey)
}

const loadYear = async (year: number, mkey?: string): Promise<string> =>
  await loadDatafile(`./data/ta/${year}.txt`, mkey)

export const getKey = async (ukey?: string): Promise<string> => {
  const userkey = ukey ?? new URLSearchParams(location.search).get('key') ?? ''
  let keys: Record<string, string>
  {
    const response = await fetch('data/keys.json')
    keys = (await response.json()) as Record<string, string>
  }
  if (userkey.length !== 22) return ''
  const upw = userkey.substring(0, 11)
  const ust = userkey.substring(11)
  const [uiv, ucipher] = keys[ust].split('.')
  return await decrypt(upw, ust, uiv, ucipher)
}

export const loadData = async (userkey?: string): Promise<string> => {
  const mkey = await getKey(userkey)
  const currentYear = new Date().getFullYear()
  const years = Array(currentYear - 2015)
    .fill(0)
    .map((_, i) => i + 2016)
  return (await Promise.all(years.map(async (y) => loadYear(y, mkey)))).join('\n')
}

export const encryptData = async (data: string): Promise<string> => {
  const userkey = new URLSearchParams(location.search).get('key') ?? ''
  const mkey = await getKey(userkey)
  const [pw, st] = (mkey ?? '').split('.')
  const salt = Uint8Array.from(st, (c) => c.charCodeAt(0))
  const key = await cryptoUtils.deriveSecretKey(pw, salt.buffer)
  const { cipher, iv } = await cryptoUtils.encryptText(key, data)
  return `${iv}.${cipher}`
}

export const storeData = (data: string) =>
  (store.banking = {
    headers: BankingAttributes,
    meta: defaultPaginMeta,
    rows: data
      .trim()
      .split('\n')
      .reverse()
      .map((r) => r.split('\t').map((w) => (w === '\\N' ? '' : w))),
  })
