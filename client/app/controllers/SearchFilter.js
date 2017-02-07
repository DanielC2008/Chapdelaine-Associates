'use strict'

app.controller('SearchFilter', function($scope, JobFactory) {
  let SFscope = this

  SFscope.filter = searchText => items.filter( item => item.value.toLowerCase().search(searchText.toLowerCase()) != -1)
  
  let items = $scope.items

  SFscope.addToJob = obj => {
    //make sure user wants to do this here........
    delete obj.value
    let objToAdd = {
      table: $scope.table,
      id: obj,
      job_number: {job_number: $scope.jobNumber}
      
    }
    JobFactory.addToJob(objToAdd)
  }

})