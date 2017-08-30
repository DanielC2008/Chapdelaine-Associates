'use strict'

app.factory('FormFactory', function($mdDialog, CompanyFactory, PropertyFactory) {
  let factory = {}

  factory.getCustomerForm = customer => {
    return {
      'First Name': {
        type: 'text',
        column: 'first_name',
        searchable: false,
        value: customer ? customer.first_name : '',
        required: true
      },
      'Middle Name': {
        type: 'text',
        column: 'middle_name',
        searchable: false,
        value: customer ? customer.middle_name : '',
        required: false
      },
      'Last Name': {
        type: 'text',
        column: 'last_name',
        searchable: false,
        value: customer ? customer.last_name : '',
        required: true
      },
      'Company Name': {
        type: 'text',
        column: 'company_name',
        searchable: true,
        searchFunction: CompanyFactory.searchForCompanies,
        value: customer ? customer.company_name : '',
        required: false
      },
      'Email': {
        type: 'text',
        column: 'email',
        searchable: false,
        value: customer ? customer.email : '',
        required: false
      },
      'Home Phone': {
        type: 'text',
        column: 'home_phone',
        searchable: false,
        value: customer ? customer.home_phone : '',
        required: false
      },
      'Mobile Phone': {
        type: 'text',
        column: 'mobile_phone',
        searchable: false,
        value: customer ? customer.mobile_phone : '',
        required: false
      },
      'Business Phone': {
        type: 'text',
        column: 'business_phone',
        searchable: false,
        value: customer ? customer.business_phone : '',
        required: false
      },
      'Fax Number': {
        type: 'text',
        column: 'fax_number',
        searchable: false,
        value: customer ? customer.fax_number : '',
        required: false
      },
      'Address': {
        type: 'text',
        column: 'address',
        searchable: true,
        searchFunction: PropertyFactory.searchForAddresses,
        value: customer ? customer.address : '',
        required: false
      },
      'City': {
        type: 'text',
        column: 'city',
        searchable: true,
        searchFunction: PropertyFactory.searchForCities,
        value: customer ? customer.city : '',
        required: false
      },
      'State': {
        type: 'text',
        column: 'state',
        searchable: true,
        searchFunction: PropertyFactory.searchForStates,
        value: customer ? customer.state : '',
        required: false
      },
      'Zip Code': {
        type: 'text',
        column: 'zip_code',
        searchable: true,
        searchFunction: PropertyFactory.searchForZipCodes,
        value: customer ? customer.zip_code : '',
        required: false
      },
      'County': {
        type: 'text',
        column: 'county',
        searchable: true,
        searchFunction: PropertyFactory.searchForCounties,
        value: customer ? customer.county : '',
        required: false
      },
      'Notes': {
        type: 'textarea',
        column: 'notes',
        searchable: false,
        value: customer ? customer.notes : '',
        required: false
      }
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