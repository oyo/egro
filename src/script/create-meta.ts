import fs, { readFileSync } from 'fs'
import path from 'path'
import * as meta from '../../package.json'
import * as crypto from 'crypto'

export const createMeta = async () => {
  const output = './src/asset/data/meta.json'

  const includePattern = /(\/blog\/history\.txt|\/(docs|ta)\/\d{4}\.txt|\/land\.txt)$/

  const md5 = (contents: string) => crypto.createHash('md5').update(contents).digest('hex')

  const readDataFileNames = (name: string): string[] =>
    fs
      .readdirSync(name, { withFileTypes: true })
      .flatMap((f: fs.Dirent) =>
        f.isDirectory() ? readDataFileNames(path.join(name, f.name)) : path.join(name, f.name),
      )

  const hash = readDataFileNames('public/data/')
    .filter((f) => includePattern.test(f))
    .reduce(
      (a, c) => ((a[c.substring(7)] = md5(readFileSync(c).toString())), a),
      {} as Record<string, string>,
    )

  fs.writeFileSync(
    output,
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
  console.log(`${output} written`)
}
