'use strict'

const schema = require('validate')
const validationHelper = require('./validationHelper')

  const employee = schema({
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
    s_s_number: {
      type: 'string',
      message: 'Social Security must be a number.'
    },
    mobile_phone: {
      type: 'string',
      message: 'Mobile phone must be a string.'
    },
    home_phone: {
      type: 'string',
      message: 'Home phone must be a string.'
    },
    date_of_birth: {
      type: 'date',
      message: 'Date of Birth must be a valid date.'
    },
    marital_status: {
      type: 'boolean',
      message: 'Marital status must be true or false.'
    },
    u_s_citizen: {
      type: 'boolean',
      message: 'Citizenship must be true or false.'
    },
    start_date: {
      type: 'date',
      message: 'Start Date must be a date.'
    },
    end_date: {
      type: 'date',
      message: 'End Date must be a date.'
    },
    position: {
      type: 'string',
      message: 'Position must be a string.'
    },
    pay_rate: {
      type: 'number',
      message: 'Pay Rate must be a number.'
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

module.exports = employee