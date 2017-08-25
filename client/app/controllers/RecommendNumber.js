'use strict'

app.controller('RecommendNumber', function($scope, DBFactory, $mdDialog, JobFactory, AlertFactory) {
  let RNScope = this

  DBFactory.getMaxNumber({table: 'Jobs'})
    .then( ({data: {max}}) => RNScope.recommended = max + 1 )
    .catch( ({data}) => console.log(data))

  RNScope.checkNumber = number => {
    let job_number = Number(number)
    if (job_number != NaN && job_number > 0) {
      JobFactory.checkJobNumberExists(job_number).then( ({data: {exists}}) => {
        if (exists) {
          AlertFactory.toastReject('It looks like this job number already exists!')
        } else {
          setNumber(job_number)
        }
      }).catch( err => console.log('err', err))
    } else {
      AlertFactory.toastReject('Job number must be a number greater than 0!')
    }
  }

  const setNumber = number => $mdDialog.hide(number)

})