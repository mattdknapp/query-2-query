const joinAsSnakeCase = (acc, next) => {
  const isUpper = next.match(/[A-Z]/)
  const nextVal = isUpper ? `_${next.toLowerCase()}` : next
  return `${acc}${nextVal}`
}

const camelToSnake = str => {
  const charArray = str.split('')
  return charArray.reduce(joinAsSnakeCase)
}

module.exports = camelToSnake
