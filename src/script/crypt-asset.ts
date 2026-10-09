import { readFileSync, writeFileSync } from 'fs'
import { decryptData, encryptData } from '@/ui/features/data'

const gkey = process.env.KEY_GLOBAL
const paths = ['public/data/land.json', 'src/asset/data/tb.csv']

paths.forEach(async (path) => {
  const [prefix, suffix] = path.split(/\./)
  const oldCrypt = readFileSync(`${prefix}.txt`, { encoding: 'utf-8' })
  const oldCompress = await decryptData(oldCrypt, gkey)

  const plain = readFileSync(path, { encoding: 'utf-8' })
  const compress = suffix === 'json' ? JSON.stringify(JSON.parse(plain)) : plain

  const diff = compress.localeCompare(oldCompress)
  if (diff === 0) {
    console.log(`ignored ${path}`)
  } else {
    console.log(`updated ${path}`)
    const crypt = await encryptData(compress)
    writeFileSync(`${prefix}.txt`, crypt)
  }
})
