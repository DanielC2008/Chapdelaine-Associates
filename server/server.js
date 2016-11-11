'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const PORT = process.env.PORT || 3000

app.use(express.static('client'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


// app.get('/', (req, res) => {

// })

app.post('/', (req, res) => {
	console.log(req.body)
})

app.listen(PORT, () => console.log(`port listening on: ${PORT}`))