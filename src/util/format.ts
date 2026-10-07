export const formatNumber = (n: number): string =>
  (n < 0 ? '' : '+') +
  n
    .toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')

export const utcToDisplayTime = (t: string): string =>
  ((d: Date) =>
    `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.toTimeString().substring(0, 8)}`)(
    new Date(t),
  )
