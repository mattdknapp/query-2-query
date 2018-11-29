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

#### `previusQuery`
There are three fixed top level options available, the first of which is
`previusQuery`. If provided `query2query-js` will start the generated query
using `AND` instead of `WHERE` and will append it's results to the string
supplied by the `previusQuery` attribute.

#### `whiteList`
The second option is `whiteList`. If `whiteList` is a truthy value any query
string key that does not have a coresponding key in the `options` object will be
ignored when the query is created. Whitelist has a default value of `true`.

NOTE: _Always_ use `whiteList: true` for anything besides debugging/development
as it would leave you open to SQL injection attacks otherwise.

#### `sort`
The third option is `sort`. This option is used to obtain the desired order of
the generated query. If present `sort` should be an array of objects that have
the following attributes:

| attribute | description |
|-----------|-------------|
| key | A column name on which sorting is allowed |
| namespace | An optional namespace to scope the key under in the created sort statement. |

The column and direction of `sort` will be derived from reading the options
`sort` and `sortOrder` from the query string object. The `sort` attribute of
the query string object will be expected to be a string value that coresponds
to one of the keys provided in the `sort` options array. `sortOrder` is
expected to be one of two string options: `ASC` or `DESC`.

#### Search Params
There are several configurations that can be nested inside of the options
object. These configurations must have the same key as their equivalent in the
provided query string to take affect. The options are listed below:

| option | description |
|--------|-------------|
| namespace | A name space to scope the item under in the created query. |
| type | The type of match desired. Options described below. |

### Match Types

`query2query-js` provides several options to format what the segment of a query
will look like. These options can be provided as the `type` attribute of the
options object as described above.

| type | description | SQL |
|------|-------------|-----|
| string | A string ilike search. NOTE: default if no value is provided | `some_item ILIKE $1` |
| integer | An exact match for an integer. | `id = $1` |
| exact | An exact match for a string. | `name = $1`
| array | An array of string values. NOTE: does not currently work with integer values| `name IN ($1,$2,$3,$4,...)`

## Example

```
const q2q = require('query2query-js')

const optionsObject = {
  whiteList: true,
  id: { type: 'integer', namespace: 'u' },
  userName: { type: 'string' },
  userEmail: { type: 'exact' },
  userHobbies: { type: 'array' },
  sort : [
    { key: 'id', namespace: 'u' },
    { key: 'userEmail' },
  ],
}

const queryString = {
  id: 1,
  userName: 'Bob',
  userEmail: 'bob@exactlythis.com',
  userHobbies: ['swimming', 'running', 'polka']
}

q2q(queryString, optionsObject)

//output
{ 
  text: 'WHERE u.id = $1 AND user_name ILIKE $2 AND user_email = $3 AND user_hobbies IN ($4,$5,$6)',
  values: [ 1, 'Bob%', 'bob@exactlythis.com', 'swimming', 'running', 'polka' ]
}

```
