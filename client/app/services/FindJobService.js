'use strict'

app.service('FindJobService', function($location) {
  const service = {}
  const Matches = {
    exact: [],
    other: []
  }

  const sorted = []

  const clearMatches = () => {
      Matches.exact.length = 0
      Matches.other.length = 0
      sorted.length = 0
  }

  const pushNew = obj => {
    let newArr = []
    newArr.push(obj)
    sorted.push(newArr)
  }

  const sortJobsByJobNumber = jobsArr => {
    jobsArr.forEach( array => {
      array.forEach( obj => {
        if (sorted.length === 0){          
          pushNew(obj)
        }else {
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
  }

  //reduces an array of objs with different properties into one obj with only one of each property
  const reduceObj = sortedArr => Object.assign(...sortedArr)

  const manyMatches = jobsArrLength => {
    sorted.forEach( sortedArr => {
        if (sortedArr.length === jobsArrLength) { //length is equal to number of parameters entered = exact match
          let obj = reduceObj(sortedArr)
          Matches.exact.push(obj)
        } else{
          let obj = reduceObj(sortedArr)
          Matches.other.push(obj)
        } 
      })
      $location.path(/jobs/)
  }

  const oneMatch = () => {
    $location.path(`/jobs/:${sorted[0][0].job_number}`)
  }


  service.setMatches = jobsArr => {
    clearMatches()
    sortJobsByJobNumber(jobsArr)
    if (sorted.length === 1 ) { //-----------if one match go to that job_number
      oneMatch()
    } else {  //-----------------------------if many allow uset to select job
      manyMatches(jobsArr.length)
    }  

  }

  service.getMatches = () => Matches 
 



  return service
})