'use strict'
const XLSX = require('xlsx')

//prep for mass seeding
module.exports = () => {
  const fullJobArray = [] 
  let jobInfo //ids placed on Jobs_Job_Types, Client_Specs_Per_Job
  let property //ids placed on Properties_Addresses, Jobs
  let client //locateOrCreate ids Jobs, Client_Specs_Per_Job, 
  let rep //locateOrCreate ids Client_Specs_Per_Job
  let owner //IF NOT CLIENT// locateOrCreate ids Client_Specs_Per_Job, 
  let jobType
  let clientType
  //let attachments --to be determined

  //create all objects that will be going to db
  const getJobInfo = job => {
    return {
      job_number:    job['Job.job_number'],
      job_status:    job['Job.job_status'],
      start_date:    job['Job.start_date'],
      complete_date: job['Job.complete_date']
    }
  } 
  const getJobType = job => {
    return {
      job_type: job['Job.job_type']
    }
  } 

  const getProp = job => {
    return {
      Map:             job['Property.Map'],
      parcel_number:   job['Property.parcel_number'],
      plat_book:       job['Property.plat_book'],
      plat_page:       job['Property.plat_page'],
      deed_book:       job['Property.deed_book'],
      deed_page:       job['Property.deed_page'],
      sub_division:    job['Property.sub_division'],
      lot_number:      job['Property.lot_number'],
      acres:           job['Property.acres'],
      state:           job['Property.state'],
      city:            job['Property.city'],
      county:          job['Property.county'],
      zip_code:        job['Property.zip_code'],
      primary_address: job['Property.primary_address'],
      primary_road:    job['Property.primary_road'],
      notes:           job['Property.notes']
    }
  } 

  const getClient = job => {
    return {
      first_name:     job['Client.first_name'], 
      middle_name:    job['Client.middle_name'],
      last_name:      job['Client.last_name'],
      email:          job['Client.email'],
      business_phone: job['Client.business_phone'],
      mobile_phone:   job['Client.mobile_phone'],
      home_phone:     job['Client.home_phone'],
      fax_number:     job['Client.fax_number'],
      state:          job['Client.state'],
      city:           job['Client.city'],
      county:         job['Client.county'],
      zip_code:       job['Client.zip_code'],
      address:        job['Client.address'],
      notes:          job['Client.notes']
    }
  }

  const getClientType = job => {
    return {
      client_type: job['Client.client_type'] 
    }
  } 

  const getRep = job => {
    return {
      first_name:     job['Rep.first_name'], 
      middle_name:    job['Rep.middle_name'],
      last_name:      job['Rep.last_name'],
      email:          job['Rep.email'],
      business_phone: job['Rep.business_phone'],
      mobile_phone:   job['Rep.mobile_phone'],
      home_phone:     job['Rep.home_phone'],
      fax_number:     job['Rep.fax_number'],
      state:          job['Rep.state'],
      city:           job['Rep.city'],
      county:         job['Rep.county'],
      zip_code:       job['Rep.zip_code'],
      address:        job['Rep.address'],
      company:        job['Rep.company'],
      company_address:job['Rep.company_address'],
      notes:          job['Rep.notes']
    }
  } 

  const getOwner = job => {
    return {
      first_name:     job['Owner.first_name'], 
      middle_name:    job['Owner.middle_name'],
      last_name:      job['Owner.last_name'],
      email:          job['Owner.email'],
      business_phone: job['Owner.business_phone'],
      mobile_phone:   job['Owner.mobile_phone'],
      home_phone:     job['Owner.home_phone'],
      fax_number:     job['Owner.fax_number'],
      state:          job['Owner.state'],
      city:           job['Owner.city'],
      county:         job['Owner.county'],
      zip_code:       job['Owner.zip_code'],
      address:        job['Owner.address'],
      notes:          job['Owner.notes']    
    }
  }

  let workbook = XLSX.readFile('C:\\Users\\Joseph\\Chapdelaine-Associates\\Chapdelaine-Associates\\database\\attachmentTest\\db_seeder.xlsx');
  let first_sheet_name = workbook.SheetNames[0];
  let worksheet = workbook.Sheets[first_sheet_name];
  let jsonified = XLSX.utils.sheet_to_json(worksheet)
  jsonified.forEach( (job, index) => {
    jobInfo = getJobInfo(job)
    jobType = getJobType(job)
    property = getProp(job)
    client = getClient(job)
    clientType = getClientType(job)
    rep = getRep(job)
    owner = getOwner(job)
    let fullJob = {
      jobInfo: jobInfo,
      jobType: jobType,
      property: property,
      client: client,
      clientType: clientType,
      rep: rep.first_name ? rep : null,
      owner: owner.first_name ? owner : null
    }
    fullJobArray.push(fullJob)
    if (index + 1 === jsonified.length) {
      seedDB()
    }
  })

  //after fullJobArray is filled we can call a function to put each jobInto db
  const seedDB = () => {
  //create job
    //store job_id
  //find jobType
    //store job_type_id
  //create property
    //store property_id  
  //create client
    //store client_id
  //find client_type
    //store client_type_id
  //create rep if rep
    //store rep_id

  //set ids Jobs_Job_Type --job_id and job_type_id
  //set ids Jobs -- property_id, main_client_id
  //set ids Client_Specs_Per_Job -- client_id, rep_id, client_type_id
  }


}

