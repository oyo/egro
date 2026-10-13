export type Point = [number, number]

export const geodesicArea = (latLngs: Array<Point>) => {
  const pointsCount = latLngs.length
  if (pointsCount < 3) return 0
  const d2r = Math.PI / 180
  let area = 0
  for (let i = 0, p1, p2; i < pointsCount; i++) {
    p1 = latLngs[i]
    p2 = latLngs[(i + 1) % pointsCount]
    area += (p2[1] - p1[1]) * d2r * (2 + Math.sin(p1[0] * d2r) + Math.sin(p2[0] * d2r))
  }
  area = (area * 6378137 * 6378137) / 2
  return Math.abs(area)
}

const dist2 = (a: Point, b: Point) => Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2)

// TODO: replace with more efficient tree search
export const findNearest = (points: Array<Point>, coord: Point) =>
  points.reduce((a, c, i) => (dist2(c, coord) < dist2(points[a], coord) ? i : a), 0)
