const translators = require('./translators')
const flatten = require('./flatten')

const getScopeString = ({ namespace }) => {
  if(namespace) {
    return `${namespace}.`
  }

  return ''
}

const sortKeys = [
  'sort',
  'sortOrder',
]

const shouldSkipKey = (key, opts) => {
  const {
    whiteList = true,
  } = opts

  const isSortData = sortKeys.includes(key)
  const keyIsApproved = !!opts[key]

  if(isSortData) {
    return true
  }


  if(whiteList && !keyIsApproved) {
    console.warn(`From query2query-js: ${key} has not been whitelisted and is therefore ignored`)
    return true
  }
}

const entriesToQuery = opts => (acc, next) => {
  const {
    whiteList,
  } = opts

  const [
    key,
  ] = next

  const shouldSkip = shouldSkipKey(key, opts)

  if(shouldSkip) {
    return acc
  }

  const optsForKey = opts[key] || {}

  const scopeString = getScopeString(optsForKey)
  const type = opts[key] && opts[key].type
  const createClause = translators[type] || translators.string

  //Use null to start a new query chain.
  if(acc === null) {
    const {
      clause,
      value,
    } = createClause(next, 0)

    const text = `WHERE ${scopeString}${clause}`
    const values = flatten([ value ])

    return {
      text,
      values,
    }
  }

  const {
    clause,
    value,
  } = createClause(next, acc.values.length)

  const text = `${acc.text} AND ${scopeString}${clause}`
  const values = flatten([
    ...acc.values,
    value,
  ])

  return {
    text,
    values,
  }
}

module.exports = entriesToQuery
