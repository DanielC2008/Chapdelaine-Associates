'use strict'

app.factory('FormFactory', function(JobFactory, $q) {
  let factory = {}
  let taskObj 
  let _initialized = $q.defer() //wait for data to return

  let createTasks = Tasks => {
    return {
      Tasks
    }
  }  

  JobFactory.getTasks()
    .then( ({data}) => {
      let Tasks = data.reduce( (obj, task) => {
        obj[task.task] = ''
        return obj
      }, {}) 
      taskObj = createTasks(Tasks)   
      _initialized.resolve(true) //data has returned and obj is finished pass true to resolve
    })
    .catch( (data) => console.log(data))

  factory.getClientForm = client => {
    return {
      'First Name':     client ? client.first_name : '', 
      'Middle Name':    client ? client.middle_name : '', 
      'Last Name':      client ? client.last_name : '', 
      'Email':          client ? client.email : '', 
      'Business Phone': client ? client.business_phone : '', 
      'Mobile Phone':   client ? client.mobile_phone : '', 
      'Home Phone':     client ? client.home_phone : '', 
      'Fax Number':     client ? client.fax_number : '',
      'Address':        client ? client.address : '', 
      'City':           client ? client.city : '', 
      'State':          client ? client.state : '', 
      'Zip Code':       client ? client.zip_code : '', 
      'County':         client ? client.county : '',
      'Notes':          client ? client.notes : ''
    }
  }  

  factory.getRepForm = rep => {
    return {
      'First Name':     rep ? rep.first_name : '', 
      'Middle Name':    rep ? rep.middle_name : '', 
      'Last Name':      rep ? rep.last_name : '', 
      'Email':          rep ? rep.email : '', 
      'Business Phone': rep ? rep.business_phone : '', 
      'Mobile Phone':   rep ? rep.mobile_phone : '', 
      'Home Phone':     rep ? rep.home_phone : '', 
      'Fax Number':     rep ? rep.fax_number : '',
      'Address':        rep ? rep.address : '', 
      'City':           rep ? rep.city : '', 
      'State':          rep ? rep.state : '', 
      'Zip Code':       rep ? rep.zip_code : '', 
      'County':         rep ? rep.county : '',
      'Company Name':   rep ? rep.company_name : '',
      'Company Address':rep ? rep.company_address: '',
      'Notes':          rep ? rep.notes : ''
    }
  }    

  factory.getPropertyForm = prop => {
    return {
      'Address':        prop ? prop.address : '',
      'Road':           prop ? prop.road : '',
      'City':           prop ? prop.city : '', 
      'State':          prop ? prop.state : '', 
      'Zip Code':       prop ? prop.zip_code : '', 
      'County':         prop ? prop.county : '',
      'Property Map':   prop ? prop.property_map : '',
      'Parcel Number':  prop ? prop.parcel_number : '',
      'Plat Book':      prop ? prop.plat_book : '',
      'Plat Page':      prop ? prop.plat_page : '',
      'Deed Book':      prop ? prop.deed_book : '',  
      'Deed Page':      prop ? prop.deed_page : '',
      'Sub Division':   prop ? prop.sub_division : '',
      'Lot Number':     prop ? prop.lot_number : '',
      'Acres':          prop ? prop.acres : null,    //--want null not string for db type number columns
      'Notes':          prop ? prop.notes : ''
    }
  }  

  factory.getJobForm = () => {
    return {
      'Job Number': '',
      'Job Status': '',
      'Invoice Number': ''
    }
  }    

  factory.getTaskForm = () => {
    return taskObj
  }

  factory.initialized = _initialized.promise

  return factory
})