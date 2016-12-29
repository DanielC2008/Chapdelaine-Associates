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

//knex test
knex('Types_Of_Work')
  .select('*')
  .join('Types_Cards', 'Types_Of_Work.type_of_work_id', '=', 'Types_Cards.type_of_work_id')
  .join('Time_Cards', 'Types_Cards.time_card_id', '=', 'Time_Cards.time_card_id')
  .join('Invoices', 'Time_Cards.invoice_id', '=', 'Invoices.invoice_id')
  .where('Invoices.invoice_id', 15)
  // .join('Time_Cards', 'invoice_id', '=', 'Invoices.invoice_id')
  // .select('*').from('Types_Of_Work').where('Types_Of_Work.type_of_work_id', 'Types_Cards.type_of_work_id')
  // .join('Types_Of_Work.type_of_work_id', 'Types_Cards.type_of_work_id')
  .then( data => {
      console.log('data', data);
    })

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
    .returning('user_name')
		.insert(body)
		.then( data => {
      res.send({user_name: data[0]})
		})
    .catch( err => {
      if (err.code === "EREQUEST") {
        res.send({msg: "User Name already exists. Please create another."})
      } else {
        res.send({msg: "An error has occured. Please try again."})
      }
    })
})

app.post('/login', ({body: {user_name, password}}, res) => {
  knex('Users')
    .where({ user_name: user_name})
    .then( listedUsers => {
      let [user] = listedUsers
      if (password === user.password){
        res.send({user_name: user.user_name})
      } else {
        res.send({msg: "User Name and/or password incorrect."})
      }
    })
    .catch( err => {
      console.log('err', err);
      res.send({msg: "An error has occured. Please try again."})
    })
})

app.listen(PORT, () => console.log(`port listening on: ${PORT}`))