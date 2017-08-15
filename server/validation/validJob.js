'use strict'

const schema = require('validate')

  const validJob = schema({
    job_number: {
      type: 'number',
      required: true,
      message: 'Job Number is required and must be a number.'
    },
    job_status: {
      type: 'string',
      message: 'Job status must be a string.'
    },
    target_date: {
      type: 'date',
      message: 'Target date must be a date.'
    }
  })

  const validCause = schema({
    cause: {
      type: 'string',
      required: true,
      message: 'Cause is required.'
    }
  })
  
  const validJobType = schema({
    job_type: {
      type: 'string',
      required: true,
      message: 'Task Name is required.'
    }
  })

module.exports = {validJobType, validCause, validJob}