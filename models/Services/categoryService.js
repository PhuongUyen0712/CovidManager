const { models } = require("..");
const { QueryTypes } = require("sequelize");
const sq = require("../../models/index");
const async = require("hbs/lib/async");
const Category = require("../Category");

const getListCategory =  () => {
    return models.Category.findAll({raw: true});
};

const addCategory = async (category) => {
  try {
    const t = await models.Category.create({
      name: category.name,
    });
  } catch (err) {
    console.log(err);
  }
};


module.exports = { getListCategory, addCategory};
