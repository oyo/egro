import fs from 'fs'
import { Crypt } from '@/shared/features/crypt'

const paths = ['public/data/docs/', 'public/data/land.json', 'src/asset/data/tb.csv']

const cryptFile = async (path: string) => {
  const [prefix, suffix] = path.split(/\./)
  let oldCompress = ''
  try {
    const oldCrypt = fs.readFileSync(`${prefix}.txt`, { encoding: 'utf-8' })
    oldCompress = await Crypt.decryptData(oldCrypt)
  } catch {
    // ignore
  }

  const plain = fs.readFileSync(path, { encoding: 'utf-8' }).trim()
  const compress = suffix === 'json' ? JSON.stringify(JSON.parse(plain)) : plain

  const diff = compress.localeCompare(oldCompress)
  if (diff === 0) {
    console.log(`ignored ${path}`)
  } else {
    console.log(`updated ${path}`)
    const crypt = await Crypt.encryptData(compress)
    fs.writeFileSync(`${prefix}.txt`, crypt)
  }
}

paths.forEach(async (path: string) =>
  fs.lstatSync(path).isDirectory()
    ? fs
        .readdirSync(path)
        .filter((f) => !f.endsWith('.txt'))
        .forEach((f) => cryptFile(path + f))
    : cryptFile(path),
)
