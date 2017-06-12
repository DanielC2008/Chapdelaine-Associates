'use strict'

const schema = require('validate')


  const client = schema({
    first_name: {
      type: 'string',
      required: true,
      message: 'First Name is required.'
    },
    last_name: {
      type: 'string',
      required: true,
      message: 'Last Name is required.'
    }
  })


module.exports = client