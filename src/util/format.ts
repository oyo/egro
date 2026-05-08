export const formatNumber = (n: number): string =>
  (n < 0 ? '' : '+') +
  n
    .toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
