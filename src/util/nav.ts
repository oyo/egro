import { NavState, type NavOption } from '@/shared/features/nav'
import { context, Pages } from '@/ui/components/nav'

export const args = new URLSearchParams(location.search)

export const getPageName = (): NavOption => {
  const page = args.get('page') ?? location.pathname.split('/').slice(2).join('/')
  return (Object.keys(Pages).includes(page) ? page : 'home') as NavOption
}

export const normPage = (page: string) => {
  args.set('page', page)
  return `${context}?${args.toString()}${location.hash}`
}

export const goTo = (page: string) => {
  const currentPage = args.get('page')
  const normUrl = normPage(page)
  if (page !== currentPage) history.pushState(page, '', normUrl)
  document.title = `egro - ${page}`
}

export const linkTo = (args: Record<string, string>) =>
  `.?${Object.entries(args).reduce(
    (a, c) => (a.set(c[0], c[1]), a),
    new URLSearchParams(location.search),
  )}`

addEventListener('popstate', (e) => NavState.setPage(e.state as NavOption))
