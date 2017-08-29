'use strict'

app.factory('FormFactory', function($mdDialog) {
  let factory = {}

  factory.getCustomerForm = customer => {
    return {
      'First Name':     customer ? customer.first_name : '', //required
      'Middle Name':    customer ? customer.middle_name : '', 
      'Last Name':      customer ? customer.last_name : '', //required
      'Email':          customer ? customer.email : '', 
      'Company Name':   customer ? customer.company_name : '', 
      'Business Phone': customer ? customer.business_phone : '', 
      'Mobile Phone':   customer ? customer.mobile_phone : '', 
      'Home Phone':     customer ? customer.home_phone : '', 
      'Fax Number':     customer ? customer.fax_number : '',
      'Address':        customer ? customer.address : '', 
      'City':           customer ? customer.city : '', 
      'State':          customer ? customer.state : '', 
      'Zip Code':       customer ? customer.zip_code : '', 
      'County':         customer ? customer.county : '',
      'Notes':          customer ? customer.notes : ''
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

  factory.getTaskForm = () => {
    return {
      'Task': '',
      'Rate': null, //number
      'Hourly': null //boolean
    }
  }

  factory.getAddressForm = () => {
    return {
      'Address': ''
    }
  }

  factory.getRoadForm = () => {
    return {
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