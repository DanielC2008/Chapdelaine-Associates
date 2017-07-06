'use strict'

const sqlErrors = errNumber => {
  if (errNumber === 2627 ) {
    return 'unique'
  }
}

module.exports = sqlErrors