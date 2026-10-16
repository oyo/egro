import { addEvents, N, Viewable } from '@/util/ui'
import homeSvg from '@/asset/img/icon/home.svg?raw'
import accountSvg from '@/asset/img/icon/account.svg?raw'
import chartSvg from '@/asset/img/icon/chart.svg?raw'
import flurSvg from '@/asset/img/icon/flur.svg?raw'
import landSvg from '@/asset/img/icon/land.svg?raw'
import { getPageName, goTo } from '@/util/nav'
import { NavState, type NavListener, type NavOption } from '@/shared/features/nav'
import { Content } from '@/ui/components/content'
import './style.css'
import { Home } from '@/ui/pages/home'
import { Flur } from '@/ui/pages/flur'
import { Land } from '@/ui/pages/land'
import { Account } from '@/ui/pages/account'
import { Chart } from '@/ui/pages/chart'

export const context = '/egro/'

const createIcon = (text: string) => {
  const svg = N('div')
  svg.innerHTML = text
  return svg.firstChild as SVGElement
}

const Icons: Record<NavOption, SVGElement> = {
  home: createIcon(homeSvg),
  account: createIcon(accountSvg),
  chart: createIcon(chartSvg),
  land: createIcon(landSvg),
  flur: createIcon(flurSvg),
}

export const Pages: Record<NavOption, Viewable> = {
  home: new Home(),
  account: new Account(),
  chart: new Chart(),
  land: new Land(),
  flur: new Flur(),
}

export class Nav extends Viewable implements NavListener {
  content: Content
  constructor(content: Content) {
    super()
    this.content = content
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
                NavState.setPage(item as NavOption)
              },
            }),
            { class: `nav-item ${item}` },
          ),
        ),
      ),
      { class: 'nav' },
    )
    NavState.subscribe(this).setPage(getPageName())
  }

  showPage(page: NavOption) {
    const options = [...this.getView().firstChild!.childNodes]
    goTo(page)
    this.content.show(Pages[page])
    options.forEach((li) => {
      const cl = (li as HTMLLIElement).classList
      const svg = li.firstChild!.firstChild! as SVGElement
      if (cl.contains(page)) {
        cl.add('selected')
        svg.innerHTML = svg.innerHTML.replaceAll('#c0c0c0', '#404040')
      } else {
        cl.remove('selected')
        svg.innerHTML = svg.innerHTML.replaceAll('#404040', '#c0c0c0')
      }
    })
  }
}
