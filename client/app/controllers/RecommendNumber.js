'use strict'

app.controller('RecommendNumber', function($scope, DBFactory, $mdDialog) {
  let RNScope = this

  DBFactory.getMaxNumber({table: 'Jobs'})
    .then( ({data: {max}}) => RNScope.recommended = max + 1 )
    .catch( ({data}) => console.log(data))

  RNScope.checkNumber = number => { //for RecommendedNumber
    let job_number = Number(number)
    if (job_number != NaN && job_number > 0) {
      setNumber(job_number)
    } else {
      ToastFactory.toastReject('Job number must be a number greater than 0!')
    }
  }

  const setNumber = number => $mdDialog.hide(number)

})