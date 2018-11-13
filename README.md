# query2query-js

## About

`query2query-js` is a simple utility for converting a JSON representation of a
query string into a SQL where clause. The package is designed to be used with
`express` and `pg` but may be useful in other contexts as well.

## Installation

To install `query2query-js` simply run the following command:
`npm install --save query2query-js`

NOTE: `query2query-js` is not the same package as `query2query`.

## Usage

`query2query-js` expects two arguments when called. The first argument is the
JSON representation of the query string you desire to parse. The second is a set
of optional instructions on how to translate the values into SQL in the form
of an object.

### The Options Object

There is a single top level option of `previousQuery`. If provided
`query2query-js` will start the generated query using `AND` instead of `WHERE`
and will append it's results to the string supplied.

There are several configurations that can be nested inside of the options
object. These configurations must have the same key as their equivalent in the
provided query string to take affect. The options are listed below:

| option | description |
|--------|-------------|
| nameSpace | A name space to scope the item under in the created query |
| type | The type of match desired |

### Match Types

`query2query-js` provides several options to format what the segment of a query
will look like. These options can be provided as the `type` attribute of the
options object as described above.

| type | description | SQL |
|------|-------------|-----|
| string | A string ilike search. NOTE: default if no value is provded | `some_item ILIKE $1` |
| integer | An exact match for an integer. | `id = $1` |
| exact | An exact match for a string. | `name = $1`

## Example

```
const q2q = require('query2query-js')

const optionsObject = {
  id: { type: 'integer', nameSpace: 'u' },
  userEmail: { type: 'exact' }
}

const queryString = {
  id: 1,
  userName: 'Bob',
  userEmail: 'bob@exactlythis.com'
}

q2q(queryString, optionsObject)

//output
{ 
  text: 'WHERE u.id = $1 AND user_name ILIKE $2 AND user_email = $3',
  values: [ 1, 'Bob%', 'bob@exactlythis.com' ]
}

```
