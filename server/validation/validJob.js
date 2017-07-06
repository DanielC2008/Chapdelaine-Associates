'use strict'

const schema = require('validate')

  const validJobType = schema({
    job_type: {
      type: 'string',
      required: true,
      message: 'Task Name is required.'
    },
    priority: {
      type: 'number',
      required: true,
      message: 'Rate is required and must be a number.'
    }
  })

module.exports = {validJobType}