import { describe, expect, it } from 'vite-plus/test'
import { findNearest, type Point } from './geo'

const ll: Array<Point> = [
  [1, 1],
  [2, 2],
  [0, 8],
  [8, 8],
  [8, 0],
]

const c0: Point = [7, 7]
const c1: Point = [1, 9]

describe('geo', () => {
  it('finds nearest', () => {
    expect(findNearest(ll, c0)).toBe(3)
    expect(findNearest(ll, c1)).toBe(2)
  })
})
