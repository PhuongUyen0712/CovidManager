const { models } = require("..");
const { QueryTypes } = require("sequelize");
const sq = require("../../models/index");
const async = require("hbs/lib/async");


// get all products
// const listProduct = () => {
//   return models.Product.findAll({ raw: true });
// };
const listProduct = () => {
  return models.Product.findAll({ 
    raw: true,
    include: [{
      model: models.Category,
      as: 'category',
      attributes: ['name'],
    }]
   });
};
const addProduct = async (product) => {
  try {
    await models.Product.create({
      name: product.name,
      image: product.image,
      note: product.note,
      price: product.price,
      quantity_unit: product.quantity_unit,
      category_id: product.category_id,
    });
  } catch (err) {
    console.log(err);
  }
};

const deleteProduct = async(product)=>{
  try{
    await models.Product.destroy({
      where:{
        id: product.id
      }
    })
  }catch(err){
    console.log(err);
  }
}

const findById = async(product)=>{
  try{
    return await models.Product.findAll({
      where:{
        id:product.id
      }
    })
  }catch(err){
    console.log(err);
  }
}

// Tim san pham dua theo category id, nhung function nay nhan vao category id 
const findByCatId = async(categoryId)=>{
  try{
    return await models.Product.findAll({
      where:{
        category_id: categoryId
      }
    })
  } catch(err){
    console.log(err);
  }
}

// Tim san pham dua theo category id, nhung function nay nhan vao product, roi lay category id cua product do
const findByCateId = async(product)=>{
  try{
    return await models.Product.findAll({
      where:{
        category_id: product.category_id
      }
    })
  } catch(err){
    console.log(err);
  }
}

const updateProduct = async(product)=>{
  try{
    await models.Product.update({
      name: product.name,
      image: product.image,
      note: product.note,
      price: product.price,
      quantity_unit: product.quantity_unit
    },{
      where:{
        id:product.id
      }
    })
  }
  catch(err){
    console.log(err);
  }
}
module.exports = { listProduct, addProduct, addProduct, deleteProduct,findById,updateProduct};
