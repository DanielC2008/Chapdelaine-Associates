'use strict'

app.factory('FormFactory', function($mdDialog, CompanyFactory, PropertyFactory) {
  let factory = {}

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
        addNewObj: {
          table: 'Companies',
          create: CompanyFactory.addNew
        },
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
      'Primary Address': {
        type: 'text',
        column: 'primary_address',
        searchable: true,
        searchFunction: PropertyFactory.searchForAddresses,
        value: prop ? prop.primary_address : '',
        required: false
      },
      'Primary Road': {
        type: 'text',
        column: 'primary_road',
        searchable: true,
        searchFunction: PropertyFactory.searchForRoads,
        value: prop ? prop.primary_road : '',
        required: false //required if no address
      },
      'City': {
        type: 'text',
        column: 'city',
        searchable: true,
        searchFunction: PropertyFactory.searchForCities,
        value: prop ? prop.city : '',
        required: false
      },
      'State': {
        type: 'text',
        column: 'state',
        searchable: true,
        searchFunction: PropertyFactory.searchForStates,
        value: prop ? prop.state : '',
        required: false
      },
      'Zip Code': {
        type: 'text',
        column: 'zip_code',
        searchable: true,
        searchFunction: PropertyFactory.searchForZipCodes,
        value: prop ? prop.zip_code : '',
        required: false
      },
      'County': {
        type: 'text',
        column: 'county',
        searchable: true,
        searchFunction: PropertyFactory.searchForCounties,
        value: prop ? prop.county : '',
        required: false
      },
      'Map': {
        type: 'text',
        column: 'property_map',
        searchable: false,
        value: prop ? prop.property_map : '',
        required: false
      },
      'Parcel Number': {
        type: 'text',
        column: 'parcel_number',
        searchable: false,
        value: prop ? prop.parcel_number : '',
        required: false
      },
      'Plat Book': {
        type: 'text',
        column: 'plat_book',
        searchable: false,
        value: prop ? prop.plat_book : '',
        required: false
      },
      'Plat Page': {
        type: 'text',
        column: 'plat_page',
        searchable: false,
        value: prop ? prop.plat_page : '',
        required: false
      },
      'Deed Book': {
        type: 'text',
        column: 'deed_book',
        searchable: false,
        value: prop ? prop.deed_book : '',  
        required: false
      },
      'Deed Page': {
        type: 'text',
        column: 'deed_page',
        searchable: false,
        value: prop ? prop.deed_page : '',
        required: false
      },
      'Sub Division': {
        type: 'text',
        column: 'sub_division',
        searchable: false,
        value: prop ? prop.sub_division : '',
        required: false
      },
      'Lot Number': {
        type: 'text',
        column: 'lot_number',
        searchable: false,
        value: prop ? prop.lot_number : '',
        required: false
      },
      'Acres': {
        type: 'number',
        column: 'acres',
        searchable: false,
        value: prop ? prop.acres : 0,
        required: false
      },
      'Notes': {
        type: 'text',
        column: 'notes',
        searchable: false,
        value: prop ? prop.notes : '',
        required: false
      }
    }
  }

  factory.getEmployeeForm = employee => {
    console.log('employee', employee)
    return {
      'First Name': {
        type: 'text',
        column: 'first_name',
        searchable: false,        
        value: employee ? employee.first_name : '',
        required: true
      },
      'Middle Name': {
        type: 'text',
        column: 'middle_name',
        searchable: false,        
        value: employee ? employee.middle_name : '', 
        required: false
      },
      'Last Name': {
        type: 'text',
        column: 'last_name',
        searchable: false,        
        value: employee ? employee.last_name : '',
        required: true
      },
      'Social Security Number': {
        type: 'text',
        column: 's_s_number',
        searchable: false,        
        value: employee ? employee.s_s_number : '', 
        required: false
      },
      'Date of Birth': {
        type: 'date',
        column: 'date_of_birth',
        searchable: false,        
        value: employee ? new Date(employee.date_of_birth): null,
        required: false
      },
      'Marital Status': {
        type: 'checkbox',
        column: 'marital_status',
        searchable: false,        
        value: employee ? employee.marital_status : false,
        required: false
      },
      'U.S. Citizen': {
        type: 'checkbox',
        column: 'u_s_citizen',
        searchable: false,        
        value: employee ? employee.u_s_citizen : false,
        required: false
      },
      'Home Phone': {
        type: 'text',
        column: 'home_phone',
        searchable: false,        
        value: employee ? employee.home_phone : '', 
        required: false
      },
      'Mobile Phone': {
        type: 'text',
        column: 'mobile_phone',
        searchable: false,        
        value: employee ? employee.mobile_phone : '',
        required: false
      },
      'Address': {
        type: 'text',
        column: 'address',
        searchable: true,
        searchFunction: PropertyFactory.searchForAddresses,
        value: employee ? employee.address : '',
        required: false
      },
      'City': {
        type: 'text',
        column: 'city',
        searchable: true,
        searchFunction: PropertyFactory.searchForCities,
        value: employee ? employee.city : '',
        required: false
      },
      'State': {
        type: 'text',
        column: 'state',
        searchable: true,
        searchFunction: PropertyFactory.searchForStates,
        value: employee ? employee.state : '',
        required: false
      },
      'Zip Code': {
        type: 'text',
        column: 'zip_code',
        searchable: true,
        searchFunction: PropertyFactory.searchForZipCodes,
        value: employee ? employee.zip_code : '',
        required: false
      },
      'County': {
        type: 'text',
        column: 'county',
        searchable: true,
        searchFunction: PropertyFactory.searchForCounties,
        value: employee ? employee.county : '',
        required: false
      },
      'Start Date': {
        type: 'date',
        column: 'start_date',
        searchable: false,        
        value: employee ? new Date(employee.start_date): null,
        required: false
      },
      'End Date': {
        type: 'date',
        column: 'end_date',
        searchable: false,        
        value: employee ? new Date(employee.end_date): null,
        required: false
      },
      'Position': {
        type: 'text',
        column: 'position',
        searchable: false,        
        value: employee ? employee.position : '', 
        required: false
      },
      'Pay Rate': {
        type: 'number',
        column: 'pay_rate',
        searchable: false,        
        value: employee ? employee.pay_rate : null,
        required: false
      }
    }
  }

  factory.getCompanyForm = company => {
    return {
      'Company Name': {
        type: 'text',
        column: 'company_name',
        searchable: false,
        value: company ? company.company_name : '',
        required: true
      },
      'Company Address': {
        type: 'text',
        column: 'company_address',
        searchable: false,
        value: company ? company.company_address : '',
        required: false
      }
    }
  }

  factory.getTaskForm = () => {
    return {
      'Task': {
        type: 'text',
        column: 'task',
        searchable: false,        
        value: '', 
        required: true
      },
      'Rate': {
        type: 'number',
        column: 'rate',
        searchable: false,        
        value: null, 
        required: true
      },
      'Hourly': {
        type: 'checkbox',
        column: 'hourly',
        searchable: false,        
        value: false, 
        required: false
      }
    }
  }

  factory.getAddressForm = () => {
    return {
      'Address': {
        type: 'text',
        column: 'address',
        searchable: false,        
        value: '', 
        required: true
      }
    }
  }

  factory.getRoadForm = () => {
    return {
      'Road': {
        type: 'text',
        column: 'road',
        searchable: false,        
        value: '', 
        required: true
      }
    }
  }

  factory.getJobTypeForm = () => {
    return {
      'Job Type': {
        type: 'text',
        column: 'job_type',
        searchable: false,        
        value: '', 
        required: true
      }
    }
  }

  factory.getCauseForm = () => {
    return {
      'Cause': {
        type: 'text',
        column: 'cause',
        searchable: false,        
        value: '', 
        required: true
      }
    }
  }

  return factory
})