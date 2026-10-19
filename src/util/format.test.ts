import { describe, expect, it } from 'vite-plus/test'
import { formatArea, formatNumber } from './format'

type FormatTestType = {
  input: number
  output: string
}

type FormatType = {
  op: (v?: number) => string
  tval: Array<FormatTestType>
}

const tdata: Record<string, FormatType> = {
  number: {
    op: formatNumber,
    tval: [
      {
        input: 1234567.8,
        output: '+1.234.567,80',
      },
    ],
  },
  area: {
    op: formatArea,
    tval: [
      {
        input: 123456,
        output: '12 34 56',
      },
      {
        input: 1234567,
        output: '123 45 67',
      },
    ],
  },
}

describe('format', () =>
  Object.keys(tdata).forEach((key) =>
    it(`formats ${key}`, () =>
      tdata[key].tval.forEach((tv) => expect(tdata[key].op(tv.input)).toBe(tv.output))),
  ))
