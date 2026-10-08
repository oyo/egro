import type { Release } from '@/shared/types/data'
import meta from '@/asset/data/meta.json'
import { decryptData } from '@/ui/features/data'

const release = meta as Release

export const fetchLatestStatic = (path: string) => fetch(`${path}?${release.hash[path] ?? ''}`)

export const fetchEncrypted = async (path: string) =>
  await decryptData(await (await fetchLatestStatic(path)).text())

export function* chunks<T>(arr: T[], n: number): Generator<T[], void> {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n)
  }
}
