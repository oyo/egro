import { N, Viewable } from '@/util/ui'
import './style.css'
import L from 'leaflet'
import Main from '@/ui/main'
import Land, {
  LandUIEventType,
  LandUIState,
  type LandUIListener,
  type LandUIStateType,
} from './index'
import { type FlstkInfo } from '@/state/landSlice'
import { store } from '@/state/store'

const geodesicArea = function (latLngs: L.LatLng[]) {
  var pointsCount = latLngs.length,
    area = 0.0,
    d2r = Math.PI / 180,
    p1,
    p2

  if (pointsCount > 2) {
    for (var i = 0; i < pointsCount; i++) {
      p1 = latLngs[i]
      p2 = latLngs[(i + 1) % pointsCount]
      area += (p2.lng - p1.lng) * d2r * (2 + Math.sin(p1.lat * d2r) + Math.sin(p2.lat * d2r))
    }
    area = (area * 6378137.0 * 6378137.0) / 2.0
  }

  return Math.abs(area)
}

const Model = {
  layers: {
    // KARTE: L.tileLayer.provider('OpenStreetMap.Mapnik'),
    KARTE: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }),
    ALKIS: L.tileLayer.wms('https://www.geodaten-mv.de/dienste/alkis_wms', {
      layers: [
        'adv_alkis_tatsaechliche_nutzung',
        //,'adv_alkis_gesetzl_festlegungen'
        //,'adv_alkis_weiteres'
        'adv_alkis_gebaeude',
        'adv_alkis_flurstuecke',
      ].join(),
      format: 'image/png',
      minZoom: 12,
      maxZoom: 26,
      transparent: true,
    }),
    IMAGE: L.imageOverlay('img/flur.png', [
      [53.39821871934239, 13.268116746445331],
      [53.441046776220375, 13.339981969174893],
    ]),
    POINTS: L.layerGroup(),
    FLURSTK: L.featureGroup(),
  },
  points: [] as Array<[number, number]>,
  polygons: {} as Record<string, number[]>,
  polygonCount: 0,
  currentPoly: [],
  hoverPoly: undefined,
}

const addPoint = ([lng, lat]: [number, number]) => {
  L.circle([lat, lng], {
    color: 'orange',
    weight: 0.5,
    radius: 3,
  })
    .addTo(Model.layers.POINTS)
    .on('click', () => {
      console.log([lat, lng])
    })

  Model.points.push([lat, lng])
}

const addFlstk = (flstk: FlstkInfo): L.Polygon<any> | null => {
  if (!flstk.geo) return null
  const fname = flstk.teil ? `${flstk.fs}/${flstk.teil}` : `${flstk.fs}`
  return L.polygon(
    flstk.geo.map((pi) => Model.points[pi]),
    {
      color: flstk.et === 1 || flstk.et === 2 ? '#008800' : '#ff8800',
      weight: 2,
    },
  )
    .addTo(Model.layers.FLURSTK)
    .on('click', () => {
      LandUIState.action({
        type: LandUIEventType.SELECT,
        value: fname,
      })
    })
    .on('mouseover', () =>
      LandUIState.action({
        type: LandUIEventType.HOVER,
        value: fname,
      }),
    )
}

let polyMap: Record<string, L.Polygon<any> | null> = {}

store.subscribe(() => {
  Model.layers.POINTS.clearLayers()
  Model.layers.FLURSTK.clearLayers()
  const flstk = store.getState().land.flstk
  flstk.coords.forEach(addPoint)
  polyMap = Object.entries(flstk.info).reduce(
    (a, c) => {
      const f = c[1]
      a[c[0]] = addFlstk(f)
      return a
    },
    {} as Record<string, L.Polygon<any> | null>,
  )
})

export const renderMap = (container: HTMLDivElement) => {
  const map = L.map(container, {
    center: [53.418, 13.298],
    zoom: 14,
  }).on('mousemove', () => {
    // console.log('\u2295 ', e.latlng)
  })
  Model.layers.KARTE.addTo(map)
  Model.layers.ALKIS.addTo(map)
  Model.layers.FLURSTK.addTo(map)
  L.control.layers(undefined, Model.layers).addTo(map)
  L.control.zoom().remove()
}

class LandMap extends Viewable implements LandUIListener {
  observer: MutationObserver
  constructor() {
    super()
    this.view = N('div')
    const callback: MutationCallback = (mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && [...mutation.addedNodes].includes(Land.getView())) {
          renderMap(this.view as HTMLDivElement)
          this.observer.disconnect()
        }
      }
    }
    this.observer = new MutationObserver(callback.bind(this))
    this.observer.observe(Main.getView(), {
      childList: true,
      subtree: false,
    })
  }
  notifyLand(event: LandUIStateType) {
    if (event.prevValue) {
      const hoverPoly = polyMap[event.prevValue]
      // @ts-expect-error
      hoverPoly?._path.setAttribute('fill-opacity', '0.2')
    }
    const hoverPoly = polyMap[event.value]
    if (event.type === LandUIEventType.SELECT) {
      const latlngs = hoverPoly?.getLatLngs()[0] as L.LatLng[]
      const area = geodesicArea(latlngs)
      console.log('area: ' + area)
    }
    // @ts-expect-error
    hoverPoly?._path.setAttribute('fill-opacity', '0.5')
  }
}

export default new LandMap()
