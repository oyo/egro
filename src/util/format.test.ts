import { describe, expect, it } from 'vite-plus/test'
import { formatArea, formatNumber } from './format'

type FormatTestType = {
  op: (v?: number) => string
  input: number
  output: string
}

const tdata: Record<string, FormatTestType> = {
  number: {
    op: formatNumber,
    input: 1234567.8,
    output: '+1.234.567,80',
  },
  area: {
    op: formatArea,
    input: 123456,
    output: '12 34 56',
  },
}

describe('format', () =>
  Object.keys(tdata).forEach((key) =>
    it(`formats ${key}`, () => expect(tdata[key].op(tdata[key].input)).toBe(tdata[key].output)),
  ))
