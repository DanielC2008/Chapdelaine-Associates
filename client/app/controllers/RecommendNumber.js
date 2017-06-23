'use strict'

app.controller('RecommendNumber', function($scope, DBFactory) {
  let RNScope = this

  DBFactory.getMaxNumber({table: $scope.tableForDB })
    .then( ({data: {max}}) => RNScope.recommended = max + 1 )
    .catch( ({data}) => console.log(data))

  RNScope.addNumber = number => $scope.numberSet(number) //tell parent the number has been set

})