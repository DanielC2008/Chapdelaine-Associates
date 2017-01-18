'use strict'

const { Router } = require('express')

const router = Router()

// public routes
router.use(require('./loginRegister'))
router.use(require('./home'))
router.use(require('./getJob'))

// add gaurd here and 
// private routes

module.exports = router