'use strict'

app.controller('AddNewClient', function($scope, $mdDialog, table, jobNumber, JobFactory) {
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
    //copy so it does not change scope
    let arrToAdd = _.cloneDeep(NEW.Client)
    arrToAdd.forEach( obj => {
      for (let prop in obj) {
        if (prop === 'display' || prop === '$$hashKey') {
          delete obj[prop]
        }
      }
    })
    return arrToAdd
  }

  NEW.send = ()  => {
    let arrToAdd = createClient()
    let dataObj = {
      table,
      arrToAdd,
      jobNumber
    }
  }

  NEW.reject = () => {
    $mdDialog.cancel()
  }


})

