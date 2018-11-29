const camelToSnake = require('./camelToSnake')

const sortOrders = [
  'DESC',
  'ASC',
]

const addNamespaceToKey = sortItem => {
  const {
    key,
    namespace,
  } = sortItem

  const snakeCaseKey = camelToSnake(key)
  if(namespace) {
    return `${namespace}.${snakeCaseKey}`
  }

  return snakeCaseKey
}

const createSortString = (query = {}, opts = {}) => {
  const {
    sort: sortOpts,
  } = opts

  const {
    sort,
    sortOrder = 'DESC',
  } = query

  if(!sortOpts) {
    return ''
  }

  const validSortItem = sortOpts.find(sortItem => sortItem.key === sort)
  const order = sortOrders.find(direction => direction === sortOrder.toUpperCase())

  if(!validSortItem) {
    const allowedKeys = sortOpts.map(item => item.key)
    const allowedKeyString = allowedKeys.join(', ')
    console.warn(`From query2query-js: ${sort} is not whitelisted as a sortable column. Allowed Values: ${allowedKeyString}`)
    return ''
  }

  if(!order) {
    console.warn(`From query2query-js: ${sortOrder} is not a valid sort order. Possible values: ASC, DESC`)
    return ''
  }

  const keyWithNamespace = addNamespaceToKey(validSortItem)

  return ` ORDER BY ${keyWithNamespace} ${order}`
}

module.exports = createSortString
