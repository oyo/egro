import { fetchEncrypted } from '@/util/data'

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
        [2016, 2022, 2023, 2024, 2025, 2026].map((y) => fetchEncrypted(`data/docs/${y}.txt`)),
      )
    )
      .join('\n')
      .split(/\n/)
      .reverse()
      .map((l) => l.split(',')),

  load: async () =>
    DocsState.setData(DocsState.state.length > 0 ? DocsState.state : await DocsState.fetch()),
}
