const axios = require('axios').default;

const service = require("../../models/Services/userAccount");
const serviceHistory = require("../../models/Services/managerHistoryService");
const https = require("https");
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const list = async(req, res) => {
    if (req.session.user.manager) {
        const result = await service.findListUser();
        res.render("admin/account", {
            sidebar: "manager",
            title: "Covid Manager",
            tag: "Account",
            account: result,
        });
    } else {
        const result = await service.findListManagers();
        res.render("admin/account", {
            sidebar: "admin",
            title: "Covid Manager",
            tag: "Account",
            account: result,
        });
    }
};

const addAccount = (req, res) => {
    if (req.session.user.manager) {
        res.render("admin/addAccount", {
            sidebar: "manager",
            tag: "Add Product",
        });
    } else {
        res.render("admin/addAccount", {
            sidebar: "admin",
            tag: "Add Product",
        });
    }
};

const detailUser = async(req, res) => {
    const id = req.params;
    const result = await service.findById(id);
    res.render("admin/accountDetail", {
        title: "Covid Manager",
        tag: "Account",
        sidebar: "admin",

        id: result[0].id,
        user_name: result[0].user_name,
        password: result[0].password,
        name: result[0].name,
        identity_card: result[0].identity_card,
        role: result[0].role,
        active: result[0].active,
        is_alert: result[0].is_alert,
        first_time: result[0].first_time,
    });
};
const editAccount = async(req, res) => {
    const id = req.params;
    const result = await service.findById(id);
    res.render("admin/accountEdit", {
        title: "Covid Manager",
        tag: "Account",
        sidebar: "admin",
        id: result[0].id,
        user_name: result[0].user_name,
        password: result[0].password,
        name: result[0].name,
        identity_card: result[0].identity_card,

        role: result[0].role,
        active: result[0].active,
        is_alert: result[0].is_alert,
    });
};
const edit = async(req, res) => {
    const acc = req.body;
    if (acc.active == undefined) {
        acc.active = false;
    } else {
        acc.active = true;
    }
    if (acc.is_alert == undefined) {
        acc.is_alert = false;
    } else {
        acc.is_alert = true;
    }
    acc.id = req.params.id;
    service.updateAccount(acc).then(res.redirect("/account/" + acc.id));
};

const add = async(req, res, user) => {
    const acc = req.body;
    if (acc.active == undefined) {
        acc.active = false;
    } else {
        acc.active = true;
    }
    if (acc.is_alert == undefined) {
        acc.is_alert = false;
    } else {
        acc.is_alert = true;
    }
    if (user.manager) {
        acc.role = "user";
    }
    if (user.admin) {
        acc.role = "manager";
    }
    acc.first_time = true;
    await service.addAccount(acc);
    const account = await service.findByUserName(acc.user_name);
    if (account != null && account.id != undefined) {
        axios.post('https://localhost:8000/signup', {
                id: account.id,
            },{httpsAgent}
            )
            .then(function(response) {
                console.log(response.status == 201);
            })
            .catch(function(error) {
                // handle error
                console.log(error);
            })
    }
    res.redirect("/account")
};
const deleteAccount = (req, res) => {
    const id = req.params;
    service.deleteAccount(id).then(res.redirect("/account"));
};

const accountDetail = (req, res) => {
    res.render("manager/productDetail", {
        sidebar: "admin",

        tag: "Account Detail",
    });
};

const updateAccount = (req, res) => {
    const acc = req.body;
    console.log(acc);
    //service.updateAccount(pt).then(res.redirect("/user"));
};
// const addUserAccount = async (req,res)=>{
//     let account = req.body;
//     let user = await service.findAccount(account)
//     console.log(user);
//     if(user){
//         req.flash("accountMessage", "Account already exists!");
//         return  res.redirect('/user/addUserAccount');
//     }
//     service.addUserAccount(account);
//     res.redirect('/dashboard');
// }
const addMoneyPage = (req, res) => {
    res.render("user/addMoney", {
        sidebar: "user",
        tag: "Add Money",
        id: req.session.id,
    });
};

const addMoney = (req, res) => {
    axios.post('https://localhost:8000/update', {
            Authorization: "Bearer " + req.session.user.access_token,
            Money: req.body.money
        },{httpsAgent}
        )
        .then(function(response) {
            // handle success
            console.log(response.status == 201);
        })
        .catch(function(error) {
            // handle error
            console.log(error);
        })
    res.redirect("/user")

};
const totalMoney = async(req, res, user) => {
    var totalMoney = 0;
    await axios.get('https://localhost:8000/find/' + user.id,{httpsAgent})
        .then(function(response) {
            // handle success
            totalMoney = response.data.total_money;
        })
        .catch(function(error) {
            // handle error
            console.log(error);
        })
        .then(function() {
            // always executed
        });

    res.render("user/total_money", {
        sidebar: "user",
        tag: "Thông Tin Số Dư",
        total_money: totalMoney,
    });

};
const listHistory = async (req, res) => {
  const log = await serviceHistory.logList();
  console.log(log);
  res.render("admin/managerHistory", {
    sidebar: "admin",
    tag: "History",
    log: log,
  });
};
module.exports = {
  addMoneyPage,
  list,
  addAccount,
  add,
  accountDetail,
  updateAccount,
  detailUser,
  editAccount,
  edit,
  deleteAccount,
  addMoney,
  totalMoney,
  listHistory,
};
    


