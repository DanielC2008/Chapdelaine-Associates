'use strict'

app.controller('JobMain', function($scope, $http) {
  let JMScope = this
  let Scope = $scope.$parent

  JMScope.addClientBySearch = () => {
    $http
      .get('api/getClientNames')//should pass in user_id here
      .then(({data}) => {
        JMScope.addClientBy = 'search'      
        $scope.items = data;
      })
      .catch(err => console.log(err))
    
  }



})