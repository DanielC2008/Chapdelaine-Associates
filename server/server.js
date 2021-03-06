'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const busboy = require('connect-busboy')
const routes = require('./routes/') // same as ./routes/index.js
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const path = require('path')
const PORT = process.env.PORT || 3002
const publicPath = path.resolve(__dirname, '../client')
const app = express()

//view engine setup
app.set('client', path.join(__dirname, '../client/'))

//middleware
app.use(session({
  store: new RedisStore({
    url: process.env.REDIS_URL || "redis://localhost:6379"
  }),
  secret: 'persistance',
  resave: true,
  saveUninitialized: true
  })
)
app.use(busboy())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
// point for static assets
app.use(express.static(publicPath))

//routes
app.use(routes)

//server
app.listen(PORT, () => console.log(`port listening on: ${PORT}`))

module.exports = { PORT }