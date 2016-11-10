'use strict'

const express = require('express')

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.static('client'))

app.set('view engine', 'pug')

app.get('/', (req, res) => {
	res.render('index')
})

app.listen(PORT, () => console.log(`port listening on: ${PORT}`))