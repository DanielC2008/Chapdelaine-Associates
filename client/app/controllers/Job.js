"use strict"

  app.controller('Job', function($scope, $location, JobFactory) {
    //========brings back info and makes all fields input until save
    let URL = $location.$$url 
    let jobNumber = URL.slice(parseInt(URL.search(":")) + 1)
    $scope.showTab = 'JobMain'
    $scope.editOptions = {}
    let editCanceled = {}
    //load data from database
    JobFactory.getJobFromDatabase(jobNumber)
      .success( Job => {
          $scope.Clients = Job.Clients
          $scope.Estimate = Job.Estimates
          $scope.Invoice = Job.Invoices
          $scope.Property = Job.Properties
          $scope.Representatives = Job.Representatives
          $scope.Job = Job.Jobs[0]
        })
        .error( data => {
          alert('Wooops. There doesn\'t seem to be anything here!')
        })
    //edit data submited by user    
    $scope.editDatabase = (table, id, key, value) => {
      removeEditOptions() 
      //make sure user wants to make these changes
      let obj = {}
      //transform key to sql table name
      obj[key.toLowerCase().replace(' ', '_')] = value
      JobFactory.editColumn({table, id, obj})
        .success( ({msg}) => {
          alert(msg);
        }).error( ({msg}) => {
          alert(msg);
        })
      }
    //set edit options on obj for easy comparison and edit canceled obj so data isn't lost 
    $scope.setEditOptions = (editType, tableName, tableIndex, index, key, value) => {
      $scope.editOptions.editType = editType
      $scope.editOptions.tableName = tableName
      $scope.editOptions.tableIndex = tableIndex
      $scope.editOptions.inputIndex = index
      editCanceled.key = key
      editCanceled.value = value
    }
    //focuses specific editOne
    $scope.changeFocus = (tableName, tableIndex, index) => {
      if (index == $scope.inputIndex && tableIndex == $scope.tIndex && tableName == $scope.table) {
        return true
      }
    }
    //if user cancels edit, reset ng-model
    $scope.revertEditChanges = obj => {
      removeEditOptions()    
      obj[editCanceled.key] = editCanceled.value
    }
    //lodash for deep equals
    $scope.compareObj = currDiv => _.isEqual($scope.editOptions, currDiv)
    //set editOptions back to null
    const removeEditOptions = () => {
      for(let key in $scope.editOptions) {
          $scope.editOptions[key] = null
      } 
    }


    $scope.editOrSave = () => {
      $scope.edit ? $scope.edit = false: $scope.edit = true
      //save to database//////////////////////////////////////////////
    }
  })