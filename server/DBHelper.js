'use strict'

module.exports = {

  getTableInfo: table => {
    
    let tableObj = {} 
    switch(table) {
      // case 'Customers':
      //   tableObj.tableName = 'Customers'
      //   tableObj.returningId = 'customer_id'
      //   tableObj.findJobId = 'job_id'
      //   break;
      // case 'Properties':
      //   tableObj.tableName = 'Properties'
      //   tableObj.returningId = 'property_id'
      //   tableObj.findJobId = 'job_id'
      //   break;
      // case 'Tasks':
      //   tableObj.tableName = 'Tasks'
      //   tableObj.connectTable = 'Invoices_Tasks'
      //   tableObj.returningId = 'task_id'
      //   tableObj.findJobId = 'invoice_id'
      //   break;
      case 'Jobs':
        tableObj.tableName = 'Jobs'
        tableObj.tableNumber = 'job_number'
        break;
      // case 'Invoices':
      //   tableObj.tableName = 'Invoices'
      //   tableObj.connectTable = 'Invoices_Tasks'
      //   tableObj.connectTableId = 'invoice_task_id'
      //   tableObj.tableNumber = 'invoice_number'
      //   break;
      // case 'Estimates':
      //   tableObj.tableName = 'Estimates'
      //   tableObj.connectTable = 'Estimates_Tasks'
      //   tableObj.connectTableId = 'estimate_task_id'
      //   break;
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
