'use strict'

const schema = require('validate')
const helper = require('./validationHelper')

  const client = schema({
    first_name: {
      type: 'string',
      required: true,
      message: 'First Name is required.'
    },
    middle_name: {
      type: 'string',
      message: 'Middle Name must be a string.'
    },
    last_name: {
      type: 'string',
      required: true,
      message: 'Last Name is required.'
    },
    email: {
      type: 'string',
      match: helper.emailChecker,
      message: 'Valid email is required.'
    },
    business_phone: {
      type: 'string',
      message: 'Business phone must be a string.'
    },
    mobile_phone: {
      type: 'string',
      message: 'Mobile phone must be a string.'
    },
    home_phone: {
      type: 'string',
      message: 'Home phone must be a string.'
    },
    fax_number: {
      type: 'string',
      message: 'Fax number must be a string.'
    },
    notes: {
      type: 'string',
      message: 'Notes must be a string.'
    },
    state: {
      type: 'string',
      message: 'State must be a string.'
    },
    city: {
      type: 'string',
      message: 'City must be a string.'
    },
    county: {
      type: 'string',
      message: 'County must be a string.'
    },
    zip_code: {
      type: 'string',
      message: 'Zip Code must be a string.'
    },
    address: {
      type: 'string',
      message: 'Address must be a string.'
    }
  })


module.exports = client