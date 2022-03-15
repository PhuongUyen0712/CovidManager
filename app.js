const express = require("express");
const cors = require("cors");
const pool = require("./config/db.config");
const hbs = require("hbs");
const path = require("path");
const flash = require("connect-flash");
const session = require('express-session');
const cookieParser = require("cookie-parser");
const app = express();

app.use(cookieParser());
app.use(flash());
app.use(
  session({
    secret: "secret",
    cookie: { maxAge: 600000 },
    resave: false,
    saveUninitialized: true,
    expires: { maxAge: 600000 },
  })
);
//routes
const patient = require("./routes/patients");
const product = require("./routes/products");
const package = require("./routes/package");
const payment = require("./routes/payment");
const treatmentPlace = require("./routes/treatmentPlace");
const userAccount = require("./routes/account");
const login = require("./routes/login");
const user = require("./routes/user");
const purchase = require("./routes/purchase");
const category = require("./routes/category");
hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

//hbs
app.set("view engine",  "hbs");
app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(__dirname + "/views/partials", function(err) {});

//cors
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//database
const { QueryTypes } = require("sequelize");
const { models } = require("./models");
const sq = require("./models/index");
const { use } = require("passport");
sq.sequelize
    .authenticate()
    .then(() => console.log("Database connected"))
    .catch((err) => console.log(err));

//set routes for server
app.use("/patient", patient);
app.use("/product", product);
app.use("/account", userAccount);
app.use("/package", package);
app.use("/payment", payment);
app.use("/treatmentPlace", treatmentPlace);
app.use("/category", category);
app.use("/login", login);
app.use("/user", user);
app.use("/purchase",purchase);
app.use("/", (req, res) => {
    if (!req.session.user) {
        res.redirect('/purchase');
        sidebar:"user"
    }
  //   if (!req.session.user) {
  //     res.render('user/purchase',{
  //       sidebar:"user",
  //     });
  // }
    //console.log(req.session.user);
    // if(req.session.user.admin){
    // res.render("manager/managerDashboard", {
    //     tag: "Dashboard",
    //     sidebar: "admin"
    // });
    // }
    // else if(req.session.user.manager){
    // res.render("manager/managerDashboard", {
    //   tag: "Dashboard",
    //   sidebar: "manager",
    // });
    // }
    if(req.session.user.manager){
      res.render("manager/managerDashboard", {
        tag: "Dashboard",
        sidebar: "manager",
      });
    }

});


//do not change
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server listening on port " + port));