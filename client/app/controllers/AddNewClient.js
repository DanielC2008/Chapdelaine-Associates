'use strict'

app.controller('AddNewClient', function($scope, $mdDialog, table, job_number, JobFactory, $route) {
  let NEW = this

  NEW.title = 'Client'

  NEW.Client = [
    {
      first_name: '', 
      display: 'First Name' 

    },
    {
      middle_name: '', 
      display: 'Middle Name' 

    },
    {
      last_name: '', 
      display: 'Last Name' 

    },
    {
      email: '', 
      display: 'Email' 

    },
    {
      business_phone: '', 
      display: 'Business Phone' 

    },
    {
      mobile_phone: '', 
      display: 'Mobile Phone' 

    },
    {
      home_phone: '', 
      display: 'Home Phone' 

    },
    {
      fax_number: '', 
      display: 'Fax Number' 

    },
    {
      address: '', 
      display: 'Address' 

    },
    {
      city: '', 
      display: 'City' 

    },
    {
      state: '', 
      display: 'State' 

    },
    {
      zip_code: '', 
      display: 'Zip Code' 

    },
    {
      county: '', 
      display: 'County' 

    },
    {
      notes: '', 
      display: 'Notes' 

    }
  ]

  const createClient = () => { 
    let objToAdd = {}
    NEW.Client.forEach( obj => {
      for (let prop in obj) {
        if (prop !== 'display' && prop !== '$$hashKey') {
          objToAdd[prop] = obj[prop]
        }
      }
    })
    return objToAdd
  }

  NEW.send = ()  => {
    let objToAdd = createClient()
    let dataObj = {
      table,
      objToAdd,
      job_number
    }
    JobFactory.addNewToJob(dataObj)
      .then( ({data}) => {
        $mdDialog.cancel()
        $route.reload()
      })
      .catch( ({data}) => console.log(data))
  }

  NEW.reject = () => {
    $mdDialog.cancel()
  }


})

