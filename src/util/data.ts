import type { Release } from '@/shared/types/data'
import meta from '@/asset/data/meta.json'
import { Crypt } from '@/shared/features/crypt'

const release = meta as Release

export const fetchLatestStatic = (path: string) => {
  try {
    return fetch(`${path}?${release.hash[path] ?? ''}`)
  } catch {
    return {
      text: () => 'error',
      json: () => '"error"',
    }
  }
}

export const fetchEncrypted = async (path: string) =>
  await Crypt.decryptData(await (await fetchLatestStatic(path)).text())

export function* chunks<T>(arr: T[], n: number): Generator<T[], void> {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n)
  }
}
