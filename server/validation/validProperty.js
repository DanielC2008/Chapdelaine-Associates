'use strict'

const schema = require('validate')
const validationHelper = require('./validationHelper')

  const property = schema({
    property_map: {
      type: 'string',
      message: 'Property Map must be a string.'
    },
    parcel_number: {
      type: 'string',
      message: 'Parcel Number must be a string.'
    },
    plat_page: {
      type: 'string',
      message: 'Plat Page must be a string.'
    },
    plat_book: {
      type: 'string',
      message: 'Plat Book must be a string.'
    },
    deed_book: {
      type: 'string',
      message: 'Deed Book must be a string.'
    },
    deed_page: {
      type: 'string',
      message: 'Deed Page must be a string.'
    },
    sub_division: {
      type: 'string',
      message: 'Sub Division must be a string.'
    },
    lot_number: {
      type: 'string',
      message: 'Lot number must be a string.'
    },
    notes: {
      type: 'string',
      message: 'Notes must be a string.'
    },
    state: {
      type: 'string',
      message: 'State must be a string.'
    },
    city: {
      type: 'string',
      message: 'City must be a string.'
    },
    county: {
      type: 'string',
      message: 'County must be a string.'
    },
    zip_code: {
      type: 'string',
      message: 'Zip Code must be a string.'
    },
    address: {
      type: 'string',
      message: 'Address must be a string.'
    },
    road: {
      type: 'string',
      message: 'Road must be a string.'
    },
    acres: { //---------------------------this allows me to require a number only if the user enters something
      type: 'number',
      use: acre => acre === null || typeof acre === 'number' ? true : false,
      message: 'Acres must be number'
    }
  })


module.exports = property