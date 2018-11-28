const translators = require('./translators')
const flat = require('./lib/flat')

const getScopeString = ({ namespace }) => {
  if(namespace) {
    return `${namespace}.`
  }

  return ''
}

const entriesToQuery = opts => (acc, next) => {
  const {
    whiteList,
  } = opts

  const [
    key,
  ] = next

  const keyIsApproved = !!opts[key]

  if(whiteList && !keyIsApproved) {
    console.warn(`From query2query-js: ${key} has not been whitelisted and is therefore ignored`)
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
    const values = flat([ value ])

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
  const values = flat([
    ...acc.values,
    value,
  ])

  return {
    text,
    values,
  }
}

const createQuery = (query = {}, opts = {}) => {
  const entries = Object.entries(query)
  const {
    previusQuery = null,
  } = opts

  return entries.reduce(entriesToQuery(opts), previusQuery) || {}
}

module.exports = createQuery
