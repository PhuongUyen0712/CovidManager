var DataTypes = require("sequelize").DataTypes;
var _ContactHistory = require("./ContactHistory");
var _LogHistory = require("./LogHistory");
var _ManagerHistory = require("./ManagerHistory");
var _NeccessaryPackage = require("./NeccessaryPackage");
var _Patient = require("./Patient");
var _PaymentHistory = require("./PaymentHistory");
var _Product = require("./Product");
var _Category = require("./Category");

var _TreatmentPlace = require("./TreatmentPlace");
var _UserAccount = require("./UserAccount");

function initModels(sequelize) {
  var ContactHistory = _ContactHistory(sequelize, DataTypes);
  var LogHistory = _LogHistory(sequelize, DataTypes);
  var ManagerHistory = _ManagerHistory(sequelize, DataTypes);
  var NeccessaryPackage = _NeccessaryPackage(sequelize, DataTypes);
  var Patient = _Patient(sequelize, DataTypes);
  var PaymentHistory = _PaymentHistory(sequelize, DataTypes);
  var Product = _Product(sequelize, DataTypes);
  var TreatmentPlace = _TreatmentPlace(sequelize, DataTypes);
  var UserAccount = _UserAccount(sequelize, DataTypes);
  var Category = _Category(sequelize, DataTypes);


  PaymentHistory.belongsTo(NeccessaryPackage, { as: "id_package_NeccessaryPackage", foreignKey: "id_package"});
  NeccessaryPackage.hasMany(PaymentHistory, { as: "PaymentHistories", foreignKey: "id_package"});
  ContactHistory.belongsTo(Patient, { as: "id_other_person_Patient", foreignKey: "id_other_person"});
  Patient.hasMany(ContactHistory, { as: "ContactHistories", foreignKey: "id_other_person"});
  ContactHistory.belongsTo(Patient, { as: "id_person_Patient", foreignKey: "id_person"});
  Patient.hasMany(ContactHistory, { as: "id_person_ContactHistories", foreignKey: "id_person"});
  LogHistory.belongsTo(Patient, { as: "id_person_Patient", foreignKey: "id_person"});
  Patient.hasMany(LogHistory, { as: "LogHistories", foreignKey: "id_person"});
  Patient.belongsTo(TreatmentPlace, { as: "treatment_place", foreignKey: "treatment_place_id"});
  TreatmentPlace.hasMany(Patient, { as: "Patients", foreignKey: "treatment_place_id"});
  ManagerHistory.belongsTo(UserAccount, { as: "id_manager_UserAccount", foreignKey: "id_manager"});
  UserAccount.hasMany(ManagerHistory, { as: "ManagerHistories", foreignKey: "id_manager"});
  PaymentHistory.belongsTo(UserAccount, { as: "id_payer_UserAccount", foreignKey: "id_payer"});
  UserAccount.hasMany(PaymentHistory, { as: "PaymentHistories", foreignKey: "id_payer"});
  Category.hasMany(Product, { as: "Product", foreignKey: "category_id"});
  Product.belongsTo(Category, { as: "category", foreignKey: "category_id"});


  return {
    ContactHistory,
    LogHistory,
    ManagerHistory,
    NeccessaryPackage,
    Patient,
    PaymentHistory,
    Product,
    TreatmentPlace,
    UserAccount,
    Category,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
