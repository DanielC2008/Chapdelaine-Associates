'use strict'

app.controller('JobMain', function($scope, $http) {
  let JMScope = this

  JMScope.addClientBySearch = () => {
    $http
      .get('api/getClientNames')//should pass in user_id here
      .then(({data}) => {
        //set these on this scope so filter function has access to it
        $scope.table = 'Jobs_Clients' 
        $scope.items = data
        JMScope.addClientBy = 'search'
      })
      .catch(err => console.log(err))
    
  }



})