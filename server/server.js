'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const busboy = require('connect-busboy')
const routes = require('./routes/') // same as ./routes/index.js
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const PORT = process.env.PORT || 3000

const config = require('../database/knexfile.js').development
const knex = require('knex')(config)

const app = express()

//middleware
app.use(session({
  store: new RedisStore({
    url: process.env.REDIS_URL || "redis://localhost:6379"
  }),
  secret: 'persistance'
}))
app.use(busboy())
app.use(express.static('client'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//routes
app.use(routes)
app.listen(PORT, () => console.log(`port listening on: ${PORT}`))
