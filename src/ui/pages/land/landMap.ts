import { N, Viewable } from '@/util/ui'
import './style.css'
import L from 'leaflet'
import Main from '@/ui/main'
import Land, { ARG_LAND_MODE, ARG_LAND_Q, type LandMode } from '.'
import HoverControl from './landHoverControl'
import {
  LandDataState,
  LandUIEventType,
  LandUIState,
  type FlstkInfo,
  type LandData,
  type LandDataListener,
  type LandUIListener,
  type LandUIStateType,
} from '../../features/land'
import shpjs from 'shpjs'
import { findNearest, type Point } from '@/util/geo'

interface PathPolygon extends L.Polygon {
  _path: SVGPathElement
}

const Model = {
  layers: {
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
      [53.398219, 13.268117],
      [53.441047, 13.339982],
    ]),
    POINTS: L.layerGroup(),
    FLURSTK: L.featureGroup(),
    SOLAR: L.imageOverlay('img/solar.jpeg', [
      [53.398, 13.2821],
      [53.4293, 13.321],
    ]),
    WIND: L.geoJson(await shpjs('data/wind.zip')),
  },
  points: [] as Array<[number, number]>,
  pointMap: {} as Record<number, L.Circle>,
  polyMap: {} as Record<string, L.Polygon<any> | null>,
  select: [] as Array<string>,
}

const addPoint = ([lng, lat]: [number, number], i: number) => {
  L.circle([lat, lng], {
    color: 'orange',
    weight: 0.5,
    radius: 3,
  })
    .addTo(Model.layers.POINTS)
    .on('click', () => {
      console.log(i, [lat, lng])
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
      className: 'map-flstk',
    },
  )
    .addTo(Model.layers.FLURSTK)
    .on('click', () => {
      const args = new URLSearchParams(location.search)
      args.set(ARG_LAND_Q, fname)
      history.pushState({}, `EGRO - ${fname}`, `${location.pathname}?${args.toString()}`)
      LandUIState.trigger({
        type: LandUIEventType.SELECT,
        value: fname,
      })
    })
    .on('mouseover', () =>
      LandUIState.trigger({
        type: LandUIEventType.HOVER,
        value: fname,
      }),
    )
    .on('mouseout', () =>
      LandUIState.trigger({
        type: LandUIEventType.HOVER,
        value: '-',
      }),
    )
}

class LandMap extends Viewable implements LandDataListener, LandUIListener {
  mode: LandMode = 'view'
  observer: MutationObserver
  map?: L.Map
  nearestPoint = 0
  nearestCursor: L.Circle = L.circle([0, 0], {
    color: 'red',
    weight: 0.9,
    radius: 4,
  })

  constructor() {
    super()
    const link = N('link', undefined, {
      rel: 'stylesheet',
      href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
      integrity: 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=',
      crossorigin: '',
    })
    ;[...document.getElementsByTagName('head')][0].appendChild(link)
    this.view = N('div')
    const callback: MutationCallback = (mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && [...mutation.addedNodes].includes(Land.getView())) {
          this.renderMap(this.view as HTMLDivElement)
          this.observer.disconnect()
        }
      }
    }
    this.observer = new MutationObserver(callback.bind(this))
    this.observer.observe(Main.getView(), {
      childList: true,
      subtree: false,
    })
    LandDataState.subscribe(this)
    LandUIState.subscribe(this)
  }

  renderMap(container: HTMLDivElement) {
    const map = (this.map = L.map(container, {
      center: [53.419, 13.3],
      zoom: 14,
    })
      .on(
        'mousemove',
        ((e: L.LeafletMouseEvent) => {
          HoverControl.setLatLng(e.latlng)
          if (this.mode === 'edit') {
            this.nearestPoint = findNearest(Model.points, [e.latlng.lat, e.latlng.lng])
            this.nearestCursor.setLatLng(Model.points[this.nearestPoint])
          }
        }).bind(this),
      )
      .on('click', (e) => {
        const p: Point = [Number(e.latlng.lng.toFixed(6)), Number(e.latlng.lat.toFixed(6))]
        console.log(p)
        if (this.mode === 'edit') {
          const d = LandDataState.state
          d.coords[this.nearestPoint] = p
          LandDataState.setData(d)
        }
      }))
    Model.layers.KARTE.addTo(map)
    Model.layers.ALKIS.addTo(map)
    //Model.layers.SOLAR.addTo(map)
    //Model.layers.WIND.addTo(map)
    Model.layers.FLURSTK.addTo(map)
    //Model.layers.POINTS.addTo(map)
    map.zoomControl.setPosition('bottomright')
    HoverControl.addTo(map)
    L.control.layers(undefined, Model.layers, { position: 'topright' }).addTo(map)
    L.DomUtil.addClass(map.getContainer(), 'crosshair-cursor-enabled')
    this.mode = new URLSearchParams(location.search).get(ARG_LAND_MODE) === 'edit' ? 'edit' : 'view'
  }

  hoverPoly(event: LandUIStateType) {
    HoverControl.setFlstk(event.value)
  }

  filterPoly(event: LandUIStateType) {
    Object.values(Model.polyMap).forEach((p) => {
      const poly = (p as PathPolygon)?._path
      if (poly) poly.classList.remove('select')
    })
    if (event.value) {
      const lg = L.featureGroup()
      event.value.split(',').forEach((f) => {
        const p = Model.polyMap[f] as PathPolygon
        if (p) {
          p._path.classList.add('select')
          lg.addLayer(p)
        }
      })
      const bbox = lg.getBounds().pad(0.2)
      this.map?.fitBounds(bbox!)
    } else this.map?.fitBounds(Model.layers.FLURSTK.getBounds())
  }

  dataLoaded(data: LandData) {
    Model.points = []
    Model.layers.POINTS.clearLayers()
    Model.layers.FLURSTK.clearLayers()
    data.coords.forEach(addPoint)
    Model.layers.POINTS.addLayer(this.nearestCursor)
    Model.polyMap = Object.entries(data.info).reduce(
      (a, c) => ((a[c[0]] = addFlstk(c[1])), a),
      {} as Record<string, L.Polygon<any> | null>,
    )
  }

  notifyLand(event: LandUIStateType) {
    ;({
      [LandUIEventType.FILTER]: this.filterPoly.bind(this),
      [LandUIEventType.HOVER]: this.hoverPoly.bind(this),
      [LandUIEventType.SELECT]: this.filterPoly.bind(this),
    })[event.type](event)
  }
}

export default new LandMap()
