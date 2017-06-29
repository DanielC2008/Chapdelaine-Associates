'use strict'

const schema = require('validate')

  const task = schema({
    task: {
      type: 'string',
      required: true,
      message: 'Task Name is required.'
    },
    rate: {
      type: 'string',
      required: true,
      message: 'Rate is required and must be a number.'
    },
    hourly: {
      type: 'string',
      required: true,
      message: 'Hourly is required and must be true or false.'
    }
  })

module.exports = task