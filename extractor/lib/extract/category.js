import { writeFileSync as write } from 'fs'
import { nextStep, clearAccumulator } from './index.js'

export const categories = []
let lastParent = null

export default (accumulator, isLineEnd, x) => {
  if (accumulator.match(/\.+\d+/) && isLineEnd) {
    const rgx = /.*(?=(?<=[a-z]|\)|\ )\.+\d+)/
    let name = accumulator.match(rgx)[0].trim()
    const fixings = name.match(/[a-z][A-Z]/g) || []
    fixings.forEach(fix => {
      const i = name.indexOf(fix) + 1
      if (i) name = name.substring(0, i)
        .concat(' ')
        .concat(name.substring(i))
    })

    const category = { name, productTypes: [] }

    // is parent category, level 0
    if (x < 3) lastParent = name
    else category.parent = lastParent

    categories.push(category)
    clearAccumulator()
  }

  if (accumulator.match(/OBSERVAÇÕES.*PRODUTOS.*\*/)) {
    write('./categories.json', JSON.stringify(categories, 1, 2))
    nextStep()
  }
}