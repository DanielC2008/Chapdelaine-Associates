'use strict'

app.controller('Form', function($scope, $mdDialog, AlertFactory, FormFactory, DBFactory, table, ids, existingObj, formType) {
  let FORM = this

  FORM.display = {}
table
  FORM.jobIdExists = ids.job_id ? true : false
  FORM.formType = formType
  FORM.length

  switch(table) {
    case 'Customers':
      FORM.title = `${formType} Customer`
      FORM.display = FormFactory.getCustomerForm(existingObj)
      break;
    case 'Properties':
      FORM.title = `${formType} Property`
      FORM.display = FormFactory.getPropertyForm(existingObj)
      break;
    case 'Employees':
      FORM.title = `${formType} Employee`
      FORM.display = FormFactory.getEmployeeForm(existingObj)
      break;
    case 'Tasks':
      FORM.title = `${formType} Task`
      FORM.display = FormFactory.getTaskForm() //if nothing passed can only update objs from admin page
      break;
    case 'Job_Types':
      FORM.title = `${formType} Job Type`
      FORM.display = FormFactory.getJobTypeForm() 
      break;
    case 'Companies':
      FORM.title = `${formType} Company`
      FORM.display = FormFactory.getCompanyForm(existingObj) 
      break;
    case 'Cancellations':
      FORM.title = `${formType} Cause For Cancellation`
      FORM.display = FormFactory.getCauseForm() 
      break;
    case 'Addresses':
      FORM.title = `${formType} Address`
      FORM.display = FormFactory.getAddressForm() 
      break;
    case 'Roads':
      FORM.title = `${formType} Road`
      FORM.display = FormFactory.getRoadForm() 
      break;
  }

  FORM.validate = () => {
    let dbObj = {}
    for(let item in FORM.display) {
      dbObj[`${FORM.display[item].column}`] = FORM.display[item].value 
    }
    let dbPackage = prepForDB(dbObj)
    if (dbPackage) {
      DBFactory.validate(dbPackage)
      .then( ({data, status}) => $mdDialog.hide({dbPackage, msg: data.msg, status}))
      .catch( ({data: {msg}}) => AlertFactory.toastReject(msg))
    }
  }

  FORM.reject = () => $mdDialog.cancel({msg: 'Nothing Saved!'})

  const prepForDB = dbObj => {
    let dbPackage = {
      dbObj,
      table,
      ids
    }
    if (table === 'Properties') {
      if (!dbObj.primary_address && !dbObj.primary_road) {
        AlertFactory.toastReject("Please enter an Address or a Road.")
      } else {
        return dbPackage
      }   
    } 
    else {
      return dbPackage   
    }
  }

  FORM.search = (searchFunction, field, addNewObj, column) => {
    searchFunction().then( (data) => {
      if (data) {
        FORM.display[field].value = data.value
        $scope.$apply()
      } else{
        //update form with table Name add new
        FormFactory.updateForm(addNewObj.table, null, {}, 'Add New')
        .then( data => {
          let dbPackage = data.dbPackage
          addNewObj.create(dbPackage).then( () => {
            //update display with value
            FORM.display[field].value = dbPackage.dbObj[column]
          }).catch( err => AlertFactory.toastReject(err.data.msg))
        }).catch(err => console.log('err', err))
      }
    }).catch( err => console.log('err', err))
  }

})

