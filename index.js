const entriesToQuery = require('./lib/entriesToQuery')
const createSortString = require('./lib/createSortString')

const createQuery = (query = {}, opts = {}) => {
  const entries = Object.entries(query)
  const {
    previusQuery = null,
    ...filteredOpts
  } = opts

  const sortOrder = createSortString(query, filteredOpts)
  const {
    text,
    values,
  } = entries.reduce(entriesToQuery(filteredOpts), previusQuery) || {}

  return {
    text: `${text}${sortOrder}`,
    values,
  }
}

module.exports = createQuery
