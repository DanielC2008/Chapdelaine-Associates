'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const busboy = require('connect-busboy')
const routes = require('./routes/') // same as ./routes/index.js
const session = require('express-session')
console.log('session', session)
const RedisStore = require('connect-redis')(session)
console.log('RedisStore', RedisStore)
const path = require('path')
const PORT = process.env.PORT || 3002
const publicPath = path.resolve(__dirname, '../client');

const app = express()

//middleware
app.use(session({
  store: new RedisStore({
    url: process.env.REDIS_URL || "redis://localhost:6379"
  }),
  secret: 'persistance',
  resave: true,
  saveUninitialized: true
}))
console.log('app', app)
app.use(busboy())
// point for static assets
app.use(express.static(publicPath));
//view engine setup
app.set('client', path.join(__dirname, '../client/'));
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//routes
app.use(routes)

//server
const server = require('http').createServer(app)
server.listen(PORT, () => console.log(`port listening on: ${PORT}`))

const closeServer = () => {
  server.close();
}

module.exports = { PORT, closeServer }