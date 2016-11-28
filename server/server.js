'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static('client'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const knex = require('knex')({

});


app.post('/', (req, res) => {
	knex('Users')
		.insert(req.body)
		.then((data) => {
			
		})
})

app.listen(PORT, () => console.log(`port listening on: ${PORT}`))