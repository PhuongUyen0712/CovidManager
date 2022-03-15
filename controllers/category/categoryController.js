const service = require("../../models/Services/categoryService");

const list = async (req, res) => {
    const pt = await service.getListCategory();
    res.render("manager/category", {
        sidebar: "manager",
        tag: "Category",
        category: pt,
    });
};

const addCategory = (req, res) => {
    res.render("manager/addCategory", {
        sidebar: "manager",
        tag: "Add Category",
    });
};
const add = (req, res) => {
    const pt = req.body;

    service.addCategory(pt);
    res.redirect("/")
};


module.exports = { list, addCategory, add };
