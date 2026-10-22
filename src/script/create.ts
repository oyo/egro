import { createMeta } from './create-meta'
import { cryptAsset } from './crypt-asset'
import { cryptBlog } from './crypt-blog'

const args = process.argv.slice(2)
let crypt = true
let meta = true
if (args.length > 0) {
  if (args[0] === 'crypt') meta = false
  else if (args[0] === 'meta') crypt = false
}

if (crypt) {
  await cryptBlog()
  await cryptAsset()
}
if (meta) await createMeta()
