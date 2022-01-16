const {models} = require("../../models");
//service
const servicePatient = require("../../models/Services/patientService");
const serviceTreatment_place = require("../../models/Services/treatment_placeService");
const serviceAddress = require("../../models/Services/addressService");

//controller
const list = async (req, res) => {
  const pt = await servicePatient.listPatient();
  for(var i=0;i<pt.length;i++){
    var address = JSON.parse(pt[i].address);
    pt[i].address = address.detail+', '+address.district+', '+address.city;
  }
  res.render("manager/patient", {
    title: "Covid Manager",
    tag: "Covid Patients",
    patient: pt,    
  });
};
const addPatient = async (req, res) => {
  const tp = await serviceTreatment_place.getListTreatmentPlace();
  const addressData = serviceAddress.getDataStringify();
  const obj = JSON.parse(addressData);
  for(var i=0;i<tp.length;i++){
    tp[i].count = await serviceTreatment_place.countPatientByTreatmentId(tp[i].id);
    if(tp[i].count<tp[i].capacity){
      tp[i].value = tp[i].id;
    }
    else{
      tp[i].style = "color:rgb(255,127,39);"
      tp[i].name = tp[i].name+" (đã đầy)"
    }
  }
  console.log(tp)
  res.render("manager/addPatient", {
    title: "Covid Manager",
    tag: "Add Patient",
    address: obj,
    addressStringify:addressData,
    treatment_place: tp,
    message: req.flash('identityMes')
  });
};
const PatientDetail = async (req, res) => {
  try{
  const patient = await servicePatient.patientDetail(req.params.id);
  const detailPatient = await servicePatient.patientDetail(req.params.id);
  var address = JSON.parse(detailPatient.address);
  detailPatient.address = address.detail+', '+address.district+', '+address.city;
  res.render("manager/patientDetail", {
    title: "Covid Manager",
    tag: "Patient Detail",
    id: req.params.id,
    patient: patient,
  });
} catch(err) {  }
};

const add = async (req, res) => {
  const pt = req.body;
  pt.status = "F0";
  let user = await servicePatient.findPatientByIdentity(pt.CMND);
  if(user){
    req.flash("identityMes","Identity card already exists!");
    return res.redirect("/patient/addPatient");
  }
  var address = '{"city":"'+pt.city+'","district":"'+pt.address_district+'","detail":"'+pt.address_detail+'"}';
  console.log(address);
  
  servicePatient.addPatient(pt,address)
    .then(res.redirect("/patient"))
};

const changeInfoPage =async (req, res) => {
  const tp = await serviceTreatment_place.getListTreatmentPlace();

  res.render('manager/updatePatient',{
  treatment_place: tp,
  id: req.query.id
  })
}
const changeInfo = async(req, res) =>{
    const pt = req.body;
    console.log(pt)
    
    servicePatient.updateSrcPatient(pt.id,pt.status);

    res.redirect("/patient");
}

const addContactPage = async (req, res) => {
  const tp = await serviceTreatment_place.getListTreatmentPlace();
  
  res.render("manager/addContactPatient", {
    message: req.flash("identityMessage"),
    title: "Covid Manager",
    tag: "Add Patient",
    treatment_place: tp,
    id: req.query.id,
  });
}
const addContact = async (req, res) => {
  let pt = req.body;
  //check identity_card
  let account = req.body;
  let user = await servicePatient.findPatientByIdentity(account.CMND);
  
  if (user) {
    req.flash("identityMessage", "Identity card already exists!");
    return res.redirect("/patient/addContact");
  }
  
  let person =await servicePatient.findPatientById(pt.id);
  pt.status ='F' + (parseInt(person.status[1]) + 1).toString();
  await servicePatient.addPatient(pt);
  let id_other_person = await servicePatient.findPatientByIdentity(pt.CMND);

  await servicePatient.addContactPatient(pt.id,id_other_person.id);
  res.redirect("/patient/"+pt.id);
}
module.exports = {
  list,
  addPatient,
  PatientDetail,
  add,
  changeInfoPage,
  changeInfo,
  addContactPage,
  addContact,
};
