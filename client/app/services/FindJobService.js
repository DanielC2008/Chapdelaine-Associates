'use strict'

app.service('FindJobService', function($location, $rootScope) {
  const service = {}
  const matches = {
    exact: [],
    other: []
  }

  const sorted = []

  const clearMatches = () => {
    matches.exact.length = 0
    matches.other.length = 0
    sorted.length = 0
  }

  const pushNew = obj => {
    let newArr = []
    newArr.push(obj)
    sorted.push(newArr)
  }

  const sortJobsByJobNumber = jobsArr => {
    return new Promise( (resolve) => {
      jobsArr.forEach( array => {
        array.forEach( obj => {
          if (sorted.length === 0){          
            pushNew(obj)
          } else {
            let index = sorted.findIndex( sortedArr => {
              return sortedArr[0].job_number === obj.job_number
            }) 
            if (index !== -1 ){
              sorted[index].push(obj)
            } else{
              pushNew(obj)
            }
          }
        })
      })
      resolve()
    })
  }

  //reduces an array of objs with different properties into one obj with only one of each property
  const reduceObj = sortedArr => Object.assign(...sortedArr)

  const manyMatches = jobsArrLength => {
    sorted.forEach( sortedArr => {
      //length is equal to number of parameters entered = exact match
      if (sortedArr.length === jobsArrLength) { 
        let obj = reduceObj(sortedArr)
        matches.exact.push(obj)
      } else{
        let obj = reduceObj(sortedArr)
        matches.other.push(obj)
      } 
    })
    $rootScope.$apply( () => $location.path('/jobs/'))
  }

  const oneMatch = jobNumber => $rootScope.$apply( () => $location.path(`/jobs/${jobNumber}`))


  service.setMatches = jobsArr => {
    clearMatches()
    sortJobsByJobNumber(jobsArr).then( () => {
      sorted.length === 1 ? oneMatch(sorted[0][0].job_number) : manyMatches(jobsArr.length) 
    }).catch( err => console.log('err', err))

  }

  service.getMatches = () => matches 
 



  return service
})