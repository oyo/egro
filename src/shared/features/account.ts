import { fetchEncrypted } from '@/util/data'

export type AccountListener = (data: string[][]) => void

export const AccountState = {
  state: [] as string[][],
  subscriber: [] as AccountListener[],

  subscribe: (listener: AccountListener) => {
    AccountState.subscriber = [...new Set([...AccountState.subscriber, listener])]
    if (AccountState.state.length > 0) listener(AccountState.state)
    return AccountState
  },

  setData: (data: string[][]) => {
    AccountState.state = data
    AccountState.subscriber.forEach((l) => l(data))
  },

  fetch: async (): Promise<string[][]> => {
    const currentYear = new Date().getFullYear()
    const years = Array(currentYear - 2015)
      .fill(0)
      .map((_, i) => i + 2016)
    const rows = (await Promise.all(years.map((y) => fetchEncrypted(`data/ta/${y}.txt`))))
      .join('\n')
      .split('\n')
      .reverse()
      .map((r) => r.split('\t').map((w) => (w === '\\N' ? '' : w)))
    return rows
  },

  load: async () =>
    AccountState.setData(
      AccountState.state.length > 0 ? AccountState.state : await AccountState.fetch(),
    ),
}
