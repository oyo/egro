import { addEvents, N, Viewable } from '@/util/ui'
import { store } from '@/state/store'
import { selectPage, type NavOption } from '@/state/navSlice'
import Home from '../pages/home'
import Account from '../pages/account'
import Land from '../pages/land'
import Main from '../main'
import accountSvg from '@/asset/img/icon/account.svg?raw'
import homeSvg from '@/asset/img/icon/home.svg?raw'
import landSvg from '@/asset/img/icon/land.svg?raw'
import './style.css'
import { goTo } from '@/util/nav'

export const context = '/egro/'

const createIcon = (text: string) => {
  const svg = N('div')
  svg.innerHTML = text
  return svg.firstChild as SVGElement
}

const Icons: Record<NavOption, SVGElement> = {
  home: createIcon(homeSvg),
  account: createIcon(accountSvg),
  land: createIcon(landSvg),
}

export const Pages: Record<NavOption, Viewable> = {
  home: Home,
  account: Account,
  land: Land,
}

class NavSingle extends Viewable {
  constructor() {
    super()
    this.view = N(
      'section',
      N(
        'ul',
        Object.keys(Pages).map((item) =>
          N(
            'li',
            addEvents(N('a', Icons[item as NavOption], { href: item }), {
              click: (e) => {
                e.preventDefault()
                store.dispatch(selectPage(item as NavOption))
              },
            }),
            { class: `nav-item ${item}` },
          ),
        ),
      ),
      { class: 'nav' },
    )
    store.subscribe(() => {
      const selected = store.getState().nav.selected as NavOption
      const options = [...this.getView().firstChild!.childNodes]
      goTo(selected)
      Main.show(Pages[selected])
      options.forEach((li) => {
        const cl = (li as HTMLLIElement).classList
        const svg = li.firstChild!.firstChild! as SVGElement
        if (cl.contains(selected)) {
          cl.add('selected')
          svg.innerHTML = svg.innerHTML.replaceAll('#c0c0c0', '#404040')
        } else {
          cl.remove('selected')
          svg.innerHTML = svg.innerHTML.replaceAll('#404040', '#c0c0c0')
        }
      })
    })
  }
}

export default new NavSingle()
