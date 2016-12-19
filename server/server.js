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

app.post('/register', ({body}, res) => {
	knex('Users')
    .returning('userName')
		.insert(body)
		.then( data => {
      res.send({userName: data[0]})
		})
    .catch( err => {
      if (err.code === "EREQUEST") {
        res.send({msg: "User Name already exists. Please create another."})
      }
    })
})

app.post('/login', ({body: {userName, password}}, res) => {
  knex('Users')
    .where({ userName: userName})
    .then( listedUsers => {
      let [user] = listedUsers
      if (password === user.password){
        res.send({userName: user.userName})
      } else {
        res.send({msg: "User name and/or password incorrect."})
      }
    })
})

app.listen(PORT, () => console.log(`port listening on: ${PORT}`))