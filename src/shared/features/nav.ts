export type NavOption = 'home' | 'account' | 'chart' | 'land' | 'flur'

export interface NavState {
  selected: string
}

export interface NavListener {
  showPage: (page: NavOption) => void
}

export const NavState = {
  state: 'home' as NavOption,
  subscriber: [] as NavListener[],

  subscribe: (listener: NavListener) => {
    NavState.subscriber = [...new Set([...NavState.subscriber, listener])]
    return NavState
  },

  setPage: (page: NavOption) => NavState.subscriber.forEach((l) => l.showPage(page)),
}
