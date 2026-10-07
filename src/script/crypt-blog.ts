import { readFileSync, writeFileSync } from 'fs'
import { decryptData, encryptData } from '@/ui/features/data'
import * as dotenv from 'dotenv'
import { chunks } from '@/util/data'
dotenv.config()

const gkey = process.env.KEY_GLOBAL
const path = 'public/data/blog/history'

const oldCrypt = readFileSync(`${path}.txt`, { encoding: 'utf-8' })
  .trim()
  .split('\n')
  .map((r) => r.split(','))
  .reduce((a, c) => ((a[c[0]] = c[1]), a), {} as Record<string, string>)

const oldClear = await Object.entries(oldCrypt).reduce(
  async (a, c) => {
    const prev = await a
    prev[c[0]] = (await decryptData(c[1], gkey)).trim()
    return prev
  },
  Promise.resolve({} as Record<string, string>),
)

const plain = readFileSync(`${path}.md`, { encoding: 'utf-8' })

const [text, tail] = plain.split(/\n\n## Anmerkung\n\n/)

const newClear = [
  ...chunks<string>(
    ['head']
      .concat(text.split(/\n\n### (\d{4})\n\n/g).map((r) => r.trim()))
      .concat(['tail'])
      .concat(`## Anmerkung\n\n${tail.trim()}`),
    2,
  ),
].map((r) => (r[0].match(/^\d{4}$/) ? [r[0], `### ${r[0]}\n\n${r[1]}`] : r))

const changed = newClear.reduce(
  (a, c) => ((a[c[0]] = c[1] !== oldClear[c[0]]), a),
  {} as Record<string, boolean>,
)

console.log(changed)

const newCrypt = (
  await Promise.all(
    newClear.map(async (r) => [r[0], changed[r[0]] ? await encryptData(r[1]) : oldCrypt[r[0]]]),
  )
)
  .map((r) => r.join())
  .join('\n')

writeFileSync(`${path}.txt`, newCrypt)
