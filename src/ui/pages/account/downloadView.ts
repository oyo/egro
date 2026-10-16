import { defaultPaginMeta, type PaginTable } from '@/shared/types/data.js'
import { tableToCsv } from '../../../shared/datautils/convert.js'
import './style.css'
import { addEvents, N } from '@/util/ui.js'

let table: PaginTable = {
  headers: [],
  meta: defaultPaginMeta,
  rows: [],
}

const download = (content: string, filename: string, contentType: string) => {
  if (!contentType) contentType = 'application/octet-stream'
  const a = document.createElement('a')
  const blob = new Blob([content], { type: contentType })
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
}

const view = addEvents(N('button', '\u21D3', { class: 'download', title: 'download CSV' }), {
  click: () => {
    if (table.rows.length > 0) download(tableToCsv(table), 'konto-umsaetze.csv', 'text/csv')
  },
})

export const setDownloadData = (data: PaginTable) => (table = data)

export default view
