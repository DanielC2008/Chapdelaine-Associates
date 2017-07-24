'use strict'

app.factory('FormFactory', function($mdDialog) {
  let factory = {}

  factory.getClientForm = client => {
    return {
      'First Name':     client ? client.first_name : '', //required
      'Middle Name':    client ? client.middle_name : '', 
      'Last Name':      client ? client.last_name : '', //required
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
      'First Name':     rep ? rep.first_name : '', //required
      'Middle Name':    rep ? rep.middle_name : '', 
      'Last Name':      rep ? rep.last_name : '', //required
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
      'Primary Address':prop ? prop.primary_address : '', //required
      'Primary Road':   prop ? prop.primary_road : '', //required if no address
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
      'Acres':          prop ? prop.acres : 0,
      'Notes':          prop ? prop.notes : ''
    }
  }  

  factory.getEmployeeForm = employee => {
    return {
      'First Name':     employee ? employee.first_name : '', //required
      'Middle Name':    employee ? employee.middle_name : '', 
      'Last Name':      employee ? employee.last_name : '', //required
      'S S Number':     employee ? employee.s_s_number : '', 
      'Date of Birth':  employee ? employee.date_of_birth : null, //date
      'Marital Status': employee ? employee.marital_status : null, //boolean
      'U S Citizen':    employee ? employee.u_s_citizen : null, //boolean
      'Home Phone':     employee ? employee.home_number : '', 
      'Mobile Phone':   employee ? employee.mobile_number : '',
      'Start Date':     employee ? employee.start_date : null, //date
      'End Date':       employee ? employee.end_date : null, //date
      'Position':       employee ? employee.position : '', 
      'Pay Rate':       employee ? employee.pay_rate : null, //number
      'Address':        employee ? employee.address : '', 
      'City':           employee ? employee.city : '', 
      'State':          employee ? employee.state : '', 
      'Zip Code':       employee ? employee.zip_code : '', 
      'County':         employee ? employee.county : ''
    }
  }  

  factory.getCompanyForm = company => {
    return {
      'Company Name':   company ? company.company_name : '', //required
      'Company Address':company ? company.company_address : ''
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
    return {
      'Task': '',
      'Rate': null, //number
      'Hourly': null //boolean
    }
  }

  factory.getAddressRoadForm = () => {
    return {
      'Address': '',
      'Road': ''
    }
  }

  factory.getJobTypeForm = () => {
    return {'Job Type': ''}
  }

  factory.getCauseForm = () => {
    return {'Cause': ''}
  }

  factory.updateForm = (table, existingObj, ids, formType) => {
    return new Promise ((resolve, reject) => { 
      let locals = {
        ids: ids,
        table: table,
        existingObj: existingObj,
        formType: formType
      }
      $mdDialog.show({
        locals,
        fullscreen: true,
        controller: 'Form as FORM',
        templateUrl: '/partials/form.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false,
        escapeToClose: false,
        multiple: true
      })
      .then( validatedObj => resolve(validatedObj))
      .catch( err => reject(err))
    })
  }  

  factory.matchDatabaseKeys = obj => {
    for (let key in obj){
      obj[key.toLowerCase().replace(/ /g, '_')] = obj[key]
      delete obj[key]
    }
    return obj
  }

  return factory
})