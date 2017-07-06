'use strict'

const schema = require('validate')
const validationHelper = require('./validationHelper')

  const company = schema({
    company_name: {
      type: 'string',
      required: true,
      message: 'Company name must be a string.'
    },
    company_address: {
      type: 'string',
      message: 'Company address must be a string.'
    }
  })


module.exports = company