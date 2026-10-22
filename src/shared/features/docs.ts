import { fetchEncrypted } from '@/util/data'
import meta from '@/asset/data/meta.json'

const includePattern = /^data\/docs\/\d{4}\.txt$/

export type DocsData = string[]

export type DocsListener = (data: DocsData[]) => void

export const DocsState = {
  state: [] as DocsData[],
  subscriber: [] as DocsListener[],

  subscribe: (listener: DocsListener) => {
    DocsState.subscriber = [...new Set([...DocsState.subscriber, listener])]
    if (DocsState.state.length > 0) listener(DocsState.state)
    return DocsState
  },

  setData: (data: string[][]) => {
    DocsState.state = data
    DocsState.subscriber.forEach((l) => l(data))
  },

  fetch: async (): Promise<string[][]> =>
    (
      await Promise.all(
        Object.keys(meta.hash)
          .filter((f) => includePattern.test(f))
          .map(fetchEncrypted),
      )
    )
      .join('\n')
      .split(/\n/)
      .reverse()
      .map((l) => l.split(',')),

  load: async () =>
    DocsState.setData(DocsState.state.length > 0 ? DocsState.state : await DocsState.fetch()),
}
