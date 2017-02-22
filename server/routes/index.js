'use strict'

const { Router } = require('express')

const router = Router()

// public routes
router.use(require('./loginRegister'))
router.use(require('./home'))
router.use(require('./getJob'))
router.use(require('./editJob'))
router.use(require('./newJob'))
router.use(require('./findJob'))

// add gaurd here and 
// private routes

module.exports = router