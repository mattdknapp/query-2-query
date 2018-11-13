const joinAsSnakeCase = (acc, next) => {
  const isUpper = next.match(/[A-Z]/)
  const nextVal = isUpper ? `_${next.toLowerCase()}` : next
  return `${acc}${nextVal}`
}

const camelToSnake = str => {
  const charArray = str.split('')
  return charArray.reduce(joinAsSnakeCase)
}

const createILike = (entry, index) => {
  const [
    key,
    rawValue,
  ] = entry

  const snakeKey = camelToSnake(key)
  const clause = `${snakeKey} ILIKE $${index + 1}`
  const value = `${rawValue}%`

  return {
    clause,
    value,
  }
}

const createExact = (entry, index) => {
  const [
    key,
    value,
  ] = entry

  const snakeKey = camelToSnake(key)
  const clause = `${snakeKey} = $${index + 1}`

  return {
    clause,
    value,
  }
}

module.exports = {
  integer: createExact,
  exact: createExact,
  string: createILike,
}
