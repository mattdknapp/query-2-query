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

const flatten = (arr) => {
  return arr.reduce(reduceArr, [])
}

module.exports = flatten
