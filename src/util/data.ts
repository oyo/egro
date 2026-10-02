import type { Release } from '@/shared/types/data'
import meta from '@/asset/data/meta.json'

const release = meta as Release

export const fetchLatestStatic = (path: string) => fetch(`${path}?${release.hash[path] ?? ''}`)
