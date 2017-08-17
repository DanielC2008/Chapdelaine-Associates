'use strict'

module.exports = {

  getTableInfo: table => {
    
    let tableObj = {} 
    switch(table) {
      case 'Jobs':
        tableObj.tableName = 'Jobs'
        tableObj.tableNumber = 'job_number'
        break;
      case 'address':
        tableObj.tableName = 'Addresses'
        tableObj.connectTable = 'Properties_Addresses'
        tableObj.tableId = 'address_id'
        break;
      case 'road':
        tableObj.tableName = 'Roads'
        tableObj.connectTable = 'Properties_Roads'
        tableObj.tableId = 'road_id'
        break;
      case 'state':
        tableObj.tableName = 'States'
        tableObj.tableId = 'state_id'
        break;
      case 'city':
        tableObj.tableName = 'Cities'
        tableObj.tableId = 'city_id'
        break;  
      case 'zip_code':
        tableObj.tableName = 'Zip_Codes'
        tableObj.tableId = 'zip_id'
        break;
      case 'county':
        tableObj.tableName = 'Counties'
        tableObj.tableId = 'county_id'
        break;
      case 'company_name':
        tableObj.tableName = 'Companies'
        tableObj.tableId = 'company_id'
        break;
    }
    return tableObj
  }












  
}
