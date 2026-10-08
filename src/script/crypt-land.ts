import { readFileSync, writeFileSync } from 'fs'
import { decryptData, encryptData } from '@/ui/features/data'

const gkey = process.env.KEY_GLOBAL
const path = 'public/data/land'

const oldCrypt = readFileSync(`${path}.txt`, { encoding: 'utf-8' })
const oldCompress = await decryptData(oldCrypt, gkey)

const plain = readFileSync(`${path}.json`, { encoding: 'utf-8' })
const compress = JSON.stringify(JSON.parse(plain))

const diff = compress.localeCompare(oldCompress)
if (diff === 0) {
  console.log('no change')
  process.exit(0)
}

console.log('encrypt and write changed file')
const crypt = await encryptData(compress)
writeFileSync(`${path}.txt`, crypt)
