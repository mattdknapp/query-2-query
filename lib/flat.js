const reduceArr = (acc, item) => {
  const isArray = Array.isArray(item)

  if (isArray) {
    return [
      ...acc,
      ...item.reduce(reduceArr, []),
    ]
  }

  return [
    ...acc,
    item,
  ]
}

const flat = (arr) => {
  return arr.reduce(reduceArr, [])
}

module.exports = flat
