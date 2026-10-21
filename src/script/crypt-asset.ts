import { readFileSync, writeFileSync } from 'fs'
import { Crypt } from '@/shared/features/crypt'

const paths = [
  'public/data/docs/2016.csv',
  'public/data/docs/2022.csv',
  'public/data/docs/2023.csv',
  'public/data/docs/2024.csv',
  'public/data/docs/2025.csv',
  'public/data/docs/2026.csv',
  'public/data/land.json',
  'src/asset/data/tb.csv',
]

paths.forEach(async (path) => {
  const [prefix, suffix] = path.split(/\./)
  let oldCompress = ''
  try {
    const oldCrypt = readFileSync(`${prefix}.txt`, { encoding: 'utf-8' })
    oldCompress = await Crypt.decryptData(oldCrypt)
  } catch {
    // ignore
  }

  const plain = readFileSync(path, { encoding: 'utf-8' }).trim()
  const compress = suffix === 'json' ? JSON.stringify(JSON.parse(plain)) : plain

  const diff = compress.localeCompare(oldCompress)
  if (diff === 0) {
    console.log(`ignored ${path}`)
  } else {
    console.log(`updated ${path}`)
    const crypt = await Crypt.encryptData(compress)
    writeFileSync(`${prefix}.txt`, crypt)
  }
})
