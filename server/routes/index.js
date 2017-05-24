'use strict'

const { Router } = require('express')

const router = Router()

// public routes
router.use(require('./loginRegister'))

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
router.use(require('./editJob'))
router.use(require('./clientsTable'))
router.use(require('./representativesTable'))
router.use(require('./propertiesTable'))
router.use(require('./newJob'))
router.use(require('./findJob'))
router.use(require('./taskBuilder'))
router.use(require('./modifyConnectingTable'))
router.use(require('./modifyTable'))
router.use(require('./attachments'))


module.exports = router