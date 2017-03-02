'use strict'

app.controller('RecommendNumber', function($scope, JobFactory) {
  let RNScope = this

  JobFactory.getMaxNumber({table: $scope.tableForDB })
    .then( ({data: {max}}) => RNScope.recommended = max + 1 )
    .catch( ({data}) => console.log(data))

  RNScope.addNumber = number => $scope.numberSet(number) //tell parent the number has been set

})