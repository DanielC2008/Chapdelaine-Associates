'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes/') // same as ./routes/index.js
const PORT = process.env.PORT || 3000

const config = require('../database/knexfile.js').development
const knex = require('knex')(config)


const app = express()

//middlewares
app.use(express.static('client'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


//routes
app.use(routes)
app.listen(PORT, () => console.log(`port listening on: ${PORT}`))