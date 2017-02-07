'use strict'

app.controller('SearchFilter', function($scope, JobFactory, $route) {
  let SFscope = this

  SFscope.filter = searchText => items.filter( item => item.value.toLowerCase().search(searchText.toLowerCase()) != -1)
  
  let items = $scope.items

  SFscope.addToJob = obj => {
    //make sure user wants to do this here........
    //value no longer needed, simply delete and recyle obj
    delete obj.value
    let dataObj = {
      table: $scope.table,
      objToAdd: obj,
      job_number: {job_number: $scope.jobNumber}
      
    }
    JobFactory.addToJob(dataObj)
      .then( ({data}) => $route.reload())
      .catch( ({data}) => console.log(data))
  }

})