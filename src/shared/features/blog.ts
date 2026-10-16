import { fetchLatestStatic } from '@/util/data'
import { Crypt } from './crypt'

type BlogListener = (data: string[]) => void

export const BlogState = {
  state: [] as string[],
  subscriber: new Set<BlogListener>(),

  subscribe: (listener: BlogListener) => {
    BlogState.subscriber.add(listener)
    return BlogState
  },

  setData: (data: string[]) => {
    BlogState.state = data
    BlogState.subscriber.forEach((l) => l(data))
  },

  fetch: async () =>
    await Promise.all(
      (await (await fetchLatestStatic('data/blog/history.txt')).text())
        .trim()
        .split('\n')
        .map(async (item) => await Crypt.decryptData(item.split(',')[1])),
    ),

  load: async () => BlogState.setData(await BlogState.fetch()),
}
