'use strict'

app.controller('EstimateJob', function($scope) {
  let EJScope = this

  EJScope.estimate = []

  const addSelectedType = () => {
    let obj = {
      type_of_work: null,
      rate: null,
      hourly: null
    }
    EJScope.estimate.push(obj)
  }

  addSelectedType()

//will come from the database
  EJScope.something = [
    {
      type_of_work: "Field",
      rate: 10,
      hourly: true
    },
    {
      type_of_work: "Office",
      rate: 20,
      hourly: true
    },
    {
      type_of_work: "1 acre",
      rate: 450,
      hourly: false
    },
    {
      type_of_work: "5 acre",
      rate: 650,
      hourly: false
    },
    {
      type_of_work: "Replace Corner",
      rate: 50,
      hourly: false
    },
  ]

  let numberOfSelections = 1

  EJScope.typesOfWork = [
    'Field',
    'Office',
    '1 acre',
    '5 acre',
    'Replace Corner'
  ]





})