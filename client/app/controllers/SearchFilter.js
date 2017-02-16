'use strict'

app.controller('SearchFilter', function($scope, JobFactory, $route, $mdDialog) {
  let SFscope = this
  let items = $scope.items
  let dataObj = {
    table: $scope.table,
    job_id: {job_id: $scope.jobId}
  }


  SFscope.filter = searchText => items.filter( item => item.value && item.value.toLowerCase().search(searchText.toLowerCase()) != -1 )
  

  SFscope.addToJob = obj => {
    //make sure user wants to do this here........
    //value no longer needed, simply delete and recyle obj
    delete obj.value
    dataObj.objToAdd =  obj

    if ( $scope.table == 'Representatives') { 
      let locals = {}
      locals.clientArray = JobFactory.createCurrentClientArray($scope.Clients)
      $mdDialog.show({
        locals,
        controller: 'ChooseClient as CC',
        templateUrl: '/partials/chooseClient.html',
        parent: angular.element(document.body),
        clickOutsideToClose:false
      }).then( clientId => {
          dataObj.objToAdd.client_id = clientId
          JobFactory.addToJob(dataObj)
            .then( () => $route.reload())
            .catch( ({data}) => console.log(data))
        })
        .catch(err => console.log(err))
    } else {
        JobFactory.addToJob(dataObj)
          .then( () => $route.reload())
          .catch( ({data}) => console.log(data))
    }
  }

})