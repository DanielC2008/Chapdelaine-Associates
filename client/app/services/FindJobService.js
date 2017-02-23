'use strict'

app.service('FindJobService', function($location) {
  const service = {}
  const Matches= {
    exact: [],
    other: []
  }
  const sorted = []

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

  const reduceObj = sortedArr => {
    let finishedObj = sortedArr.reduce( (prev, curr) => {
      return Object.assign({}, prev, curr)
    },{})
    return finishedObj
  }

  service.setMatches = jobsArr => {
    sortJobsByJobNumber(jobsArr)
    sorted.forEach( sortedArr => {
      if (sortedArr.length === jobsArr.length) { //length is equal to number of parameters entered = exact match
        let obj = reduceObj(sortedArr)
        Matches.exact.push(obj)
      } else{
        let obj = reduceObj(sortedArr)
        Matches.other.push(obj)
      } 
    })
    $location.path(/jobs/)
  }

  service.getMatches = () => Matches 
 



  return service
})