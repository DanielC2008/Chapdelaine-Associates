'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const PORT = process.env.PORT || 3000
const DBCreds = require('../DBCreds.js')

app.use(express.static('client'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

var knex = require('knex')({
  client: 'mssql',
  connection: DBCreds
});


//Home
app.get('/home', (req, res) => {
  res.send([
    {
      firstName: 'Daniel',
      lastName: 'Chapdelaine',
      number: '37438'
    },
    {
      firstName: 'wruiwyr',
      lastName: 'something',
      number: '23414'
    },
    {
      firstName: 'Daniel',
      lastName: 'youuuuuu',
      number: '45645'
    },
    {
      firstName: 'Daniel',
      lastName: 'Santafeeee',
      number: '23547'
    },
    {
      firstName: 'you',
      lastName: 'creeeper',
      number: '77353'
    },
    {
      firstName: 'dome',
      lastName: 'domedomedome',
      number: '57846'
    } 
  ])
})


//Login register... need to split this apart
app.post('/', (req, res) => {
	knex('Users')
		.insert(req.body)
		.then((data) => {
		})
})

app.listen(PORT, () => console.log(`port listening on: ${PORT}`))