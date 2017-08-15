'use strict'

const { Router } = require('express')

const router = Router()

// public routes
router.use(require('./usersTable'))

// add gaurd here and 
router.use((req, res, next) => {
  if(req.session.user) {
    next()
  } else {
    res.status(400).send('Please Log In.');
  }
})

// private routes
router.use(require('./home'))
router.use(require('./getJob'))
router.use(require('./jobTable'))
router.use(require('./customersTable'))
router.use(require('./propertiesTable'))
router.use(require('./findJob'))
router.use(require('./tasksTable'))
router.use(require('./attachmentsTable'))
router.use(require('./companiesTable'))
router.use(require('./jobTypesTable'))
router.use(require('./cancellationsTable'))
router.use(require('./generic'))


module.exports = router