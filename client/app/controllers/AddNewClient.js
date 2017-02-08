'use strict'

app.controller('AddNewClient', function($scope, $mdDialog) {
  let NEW = this
  NEW.title = 'Client'
  NEW.Clients = [
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

NEW.create= ()  => {
  console.log(NEW.Clients);
}


})

