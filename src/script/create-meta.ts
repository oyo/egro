import fs, { readFileSync } from 'fs'
import path from 'path'
import * as meta from '../../package.json'
import * as crypto from 'crypto'

const md5 = (contents: string) => crypto.createHash('md5').update(contents).digest('hex')

const readDataFileNames = (name: string): string[] =>
  fs
    .readdirSync(name, { withFileTypes: true })
    .flatMap((f: fs.Dirent) =>
      f.isDirectory() ? readDataFileNames(path.join(name, f.name)) : path.join(name, f.name),
    )

const hash = readDataFileNames('public/data/').reduce(
  (a, c) => ((a[c.substring(7)] = md5(readFileSync(c).toString())), a),
  {} as Record<string, string>,
)

fs.writeFileSync(
  './src/asset/data/meta.json',
  JSON.stringify(
    {
      version: meta.version,
      build: new Date().toISOString(),
      hash,
    },
    null,
    2,
  ),
)
