export type NavOption = 'home' | 'account' | 'chart' | 'land' | 'flur'

export type NavListener = (page: NavOption) => void

export const NavState = {
  state: 'home' as NavOption,
  subscriber: [] as NavListener[],

  subscribe: (listener: NavListener) => {
    NavState.subscriber = [...new Set([...NavState.subscriber, listener])]
    if (NavState.state !== 'home') listener(NavState.state)
    return NavState
  },

  setPage: (page: NavOption) => NavState.subscriber.forEach((l) => l(page)),
}
