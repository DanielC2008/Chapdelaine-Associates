'use strict'

app.controller('SearchFilter', function($scope, JobFactory, $route, $mdDialog) {
  let SFscope = this
  let items = $scope.items
  let dataObj = {
    table: $scope.table
  }


  SFscope.filter = searchText => items.filter( item => item.value && item.value.toLowerCase().search(searchText.toLowerCase()) != -1 )
  
  SFscope.addToJob = obj => {
    //make sure user wants to do this here........
    //value no longer needed, delete and recyle obj
    delete obj.value
    dataObj.objToAdd = obj
    dataObj.objToAdd.job_id =  $scope.jobId

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
            .then( ({data: {msg}}) => {
              JobFactory.toastSuccess(msg)
              $route.reload()
            })
            .catch( () => JobFactory.toastReject())
        })
        .catch(err => console.log(err))
    } else {
      //--------------------------------------------could break this apart. If clients add client type
        JobFactory.addToJob(dataObj)
          .then( ({data: {msg}}) => {
              JobFactory.toastSuccess(msg)
              $route.reload()
            })
          .catch( () => JobFactory.toastReject())
    }
  }

})