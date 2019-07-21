import { writeFileSync as write } from 'fs'
import { nextStep, clearAccumulator } from './index.js'
import { categories } from './category.js'

export const items = []
const columns = [
  2.5, // item
  11.9, // option 1
  21.6, // option 2
  31.3, // option 3
  40.8 // option 4
]
let category = null
let currentColumn = 0
let currentLine = 0
let lastItemLine = 0

export default (accumulator, isLineEnd, x, y, nextLines) => {
  if (isLineEnd) currentLine++
  if (y <= 4) return

  // header
  const line = accumulator.concat(nextLines).trim()
  if (findCategory(line) && line.match(/ITEM/)) {
    // category change
    if (accumulator.match(/ITEM.*Opção.*1.*Opção.*2.*Opção.*3.*Opção.*4/) &&
    isLineEnd) {
      category = findCategory(accumulator).name
      clearAccumulator()
      return
    }
    return
  }

  // item
  let currentItem = items.slice().pop()
  if (x > columns[0] && x < columns[1]) {
    if (currentLine !== lastItemLine)
      items.push({ name: accumulator, category, options: [] })
    else currentItem.name += accumulator

    currentColumn = 0
    lastItemLine = currentLine
    clearAccumulator()
    return
  }

  // options
  const column = columns.find((c, i) => x > c && x < (columns[i + 1] || 200))
  const index = columns.indexOf(column)
  if (index > currentColumn) {
    currentColumn = index
    currentItem.options.push({ name: accumulator })
  } else {
    const currentOption = currentItem.options.slice().pop()
    currentOption.name += accumulator
  }
  clearAccumulator()
}

export const finalizeItems = () => {
  console.log('items extracted, finalizing')
  const adjustedItems = adjustItems()
  write('./items.json', JSON.stringify(adjustedItems, 1, 2))
  nextStep()
}

const adjustItems = () => {
  const fixOptions = options => options.map(o => ({ name: o.name.trim() }))
    .filter(o => o.name.length > 1)

  return items.reduce((arr, i) => {
    const name = removeRoman(i.name)
    let item = arr.find(ai => ai.name === name)

    if (item) item.options = item.options.concat(fixOptions(i.options))
    else arr.push({ ...i, name, options: fixOptions(i.options)})
    return arr
  }, [])
}

const findCategory = accumulator => categories.find(c =>
  accumulator.match(
    new RegExp(`^${c.name.replace(/\ /g, '.*')}`)
  )
);

const removeRoman = text => {
  let result = text.trim().match(/[IVXLCDM]+$/)
  if (result) return text.substring(0, result.index).trim()
  else return text
}