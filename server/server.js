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


//Home
app.get('/home', (req, res) => {
  res.send([
    {
      name: 'Chapdelaine, Daniel',
      number: '37438'
    },
    {
      name: 'Chapdelaine, wruiwyr',
      number: '23414'
    },
    {
      name: 'Chapdelaine, Daniel',
      number: '45645'
    },
    {
      name: 'hsfa, Daniel',
      number: '23547'
    },
    {
      name: 'Chapdelaine, you',
      number: '77353'
    },
    {
      name: 'Chapdelaine, dome',
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