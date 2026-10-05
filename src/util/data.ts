import type { Release } from '@/shared/types/data'
import meta from '@/asset/data/meta.json'

const release = meta as Release

export const fetchLatestStatic = (path: string) => fetch(`${path}?${release.hash[path] ?? ''}`)

export function* chunks<T>(arr: T[], n: number): Generator<T[], void> {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n)
  }
}
