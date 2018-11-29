const entriesToQuery = require('./lib/entriesToQuery')
const createSortString = require('./lib/createSortString')

const createQuery = (query = {}, opts = {}) => {
  const entries = Object.entries(query)
  const {
    previusQuery = null,
  } = opts

  const sortOrder = createSortString(query, opts)
  const {
    text,
    values,
  } = entries.reduce(entriesToQuery(opts), previusQuery) || {}

  return {
    text: `${text}${sortOrder}`,
    values,
  }
}

module.exports = createQuery
