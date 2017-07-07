'use strict'

app.controller('Admin_Cancellations', function($scope, JobFactory) {
const ACA = this

JobFactory.getCauses().then( ({data}) => {
    ACA.causes = data
  }) 
})