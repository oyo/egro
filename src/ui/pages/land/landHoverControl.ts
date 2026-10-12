import { N } from '@/util/ui'
import { Control, LatLng, Map } from 'leaflet'

const LEN = 4

class HoverControl extends Control {
  view: HTMLElement = N('div') as HTMLElement
  latlng: L.LatLng = new LatLng(0, 0)
  flstk: string = '-'
  text: Text = new Text('')

  onAdd(_map: Map) {
    this.view = N('div', this.text, { id: 'latlng-view' }) as HTMLElement
    this.updateView()
    return this.view
  }

  updateView() {
    this.text.textContent = `\u2295 ${this.latlng.lat.toFixed(LEN)} ${this.latlng.lng.toFixed(LEN)} \u2299 ${this.flstk}`
  }

  setLatLng(ll: L.LatLng) {
    this.latlng = ll
    this.updateView()
  }

  setFlstk(fs: string) {
    this.flstk = fs
    this.updateView()
  }
}

export default new HoverControl({ position: 'bottomleft' })
