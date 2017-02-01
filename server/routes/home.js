'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()


router.get('/api/activeJobs', (req, res) => {
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
      lastName: 'youuuuuu',
      number: '45645'
    },
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
    }
  ])
})

router.get('/api/pendingJobs', (req, res) => {
  res.send([
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

//this will go to database
router.get('/api/typesOfWork', (req, res) => {
  res.send([
    'Field',
    'Office',
    '1 acre',
    '5 acre',
    'Replace Corner'
  ])
})  

//this will go to database
router.post('/api/getTypeOfWork', ({body:{typeOfWork}}, res) => {
  let allTypes = [
    {
      type_of_work: "Field",
      rate: 10,
      hourly: true
    },
    {
      type_of_work: "Office",
      rate: 20,
      hourly: true
    },
    {
      type_of_work: "1 acre",
      rate: 450,
      hourly: false
    },
    {
      type_of_work: "5 acre",
      rate: 650,
      hourly: false
    },
    {
      type_of_work: "Replace Corner",
      rate: 50,
      hourly: false
    }
  ]
   allTypes.forEach( obj => {
      if (obj.type_of_work === typeOfWork) {
        res.send(obj)
      }
    })
})  

////////////////////////////////////////////////////////////need to decide whether to use this
router.post('/api/findJob/getTableNames', (req, res) => {
  knex('is_Table_Searchable')
  .select('table_name')
  .where({find_job: true})
  .then( tableNames => {
    console.log(tableNames);
    res.send(tableNames)
  })
  .catch( err => {
    console.log('err', err)
  })
})


module.exports = router