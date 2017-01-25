"use strict"

  app.controller('Job', function($scope, $location, JobFactory) {
    let URL = $location.$$url 
    let jobNumber = URL.slice(parseInt(URL.search(":")) + 1)
    $scope.showTab = 'JobMain'
    $scope.editOne = null
    $scope.table
    $scope.inputIndex
    $scope.tIndex
    let editCanceled = {}

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

    $scope.makeChange = (table, id, key, value) => {
      $scope.editOne = false
      $scope.table = null
      $scope.tIndex = null
      $scope.inputIndex = null
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
    //must redigest everytime inorder for input focus to work properly
    $scope.inputToFocus = (tableName, tableIndex, index, key, value) => {
      $scope.editOne = true
      editCanceled.key = key
      editCanceled.value = value
      $scope.table = tableName
      $scope.tIndex = tableIndex
      $scope.inputIndex = index
    }

    $scope.changeFocus = (tableName, tableIndex, index) => {
      if (index == $scope.inputIndex && tableIndex == $scope.tIndex && tableName == $scope.table) {
        return true
      }
    }

    $scope.revertEditChanges = obj => {
      $scope.editOne = false
      $scope.table = null
      $scope.tIndex = null
      $scope.inputIndex = null
      obj[editCanceled.key] = editCanceled.value
    }


    // $scope.editOrSave = () => {
    //   $scope.edit ? $scope.edit = false: $scope.edit = true
    //   //save to database//////////////////////////////////////////////
    // }
  })