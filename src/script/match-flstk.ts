import fs from 'fs'

const csv = fs.readFileSync('/Users/martin/Downloads/warbende-flstk.csv', 'utf-8')
const data = csv
  .toString()
  .trim()
  .split('\n')
  .map((l) => l.split(',').slice(0, 2).join('/').replace(/\/$/, '/0'))
console.log(data)

const json = fs.readFileSync('/Users/martin/work/oyo/egro/public/data/land.json', 'utf-8')
const jdata = Object.keys(JSON.parse(json.toString().trim()).info).map((f) =>
  f
    .split('/')
    .map((t) => t.padStart(3, ' '))
    .join('/'),
)
console.log(
  JSON.stringify(
    jdata.sort((a, b) => {
      return a.localeCompare(b)
    }),
  ),
)

//console.log(data.filter((f) => !jdata.includes(f)).length)
