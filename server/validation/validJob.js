'use strict'

const schema = require('validate')

  //create Job validation

  //valid cancel
  
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