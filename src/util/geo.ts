import L from 'leaflet'

export const geodesicArea = (latLngs: L.LatLng[]) => {
  const pointsCount = latLngs.length
  if (pointsCount < 3) return 0
  const d2r = Math.PI / 180
  let area = 0
  for (let i = 0, p1, p2; i < pointsCount; i++) {
    p1 = latLngs[i]
    p2 = latLngs[(i + 1) % pointsCount]
    area += (p2.lng - p1.lng) * d2r * (2 + Math.sin(p1.lat * d2r) + Math.sin(p2.lat * d2r))
  }
  area = (area * 6378137 * 6378137) / 2
  return Math.abs(area)
}
