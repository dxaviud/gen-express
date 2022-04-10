const { body, validationResult } = require("express-validator");
const argon2 = require("argon2");
const User = require("../models/user");

exports.getRegister = (_, res) => {
  res.render("register", { title: "Register" });
};

exports.register = [
  body("username", "Username must be specified").isLength({ min: 1, max: 100 }),
  body("password", "Passowrd must be specified").isLength({ min: 1 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("register", { title: "Register", errors: errors.array() });
    } else {
      User.findOne({ username: req.body.username }, async (err, user) => {
        if (err) {
          return next(err);
        }
        if (user) {
          res.render("register", {
            title: "Register",
            errors: [
              {
                msg: `Username ${req.body.username} already exists, please pick another`,
              },
            ],
          });
        } else {
          const hash = await argon2.hash(req.body.password);
          const user = new User({
            username: req.body.username,
            password: hash,
          });
          user.save((err) => {
            if (err) {
              return next(err);
            }
            req.session.username = req.body.username;
            res.redirect("/catalog");
          });
        }
      });
    }
  },
];

exports.getLogin = (_, res) => {
  res.render("login", { title: "Login" });
};

exports.login = [
  body("username", "Username must be specified").isLength({ min: 1, max: 100 }),
  body("password", "Passowrd must be specified").isLength({ min: 1 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("login", { title: "Login", errors: errors.array() });
    } else {
      User.findOne({ username: req.body.username }, async (err, user) => {
        if (err) {
          return next(err);
        }
        if (user) {
          if (await argon2.verify(user.password, req.body.password)) {
            req.session.username = req.body.username;
            res.redirect("/catalog");
          } else {
            res.render("login", {
              title: "Login",
              errors: [
                {
                  msg: `Invalid password`,
                },
              ],
            });
          }
        } else {
          res.render("login", {
            title: "Login",
            errors: [
              {
                msg: `Invalid username: ${req.body.username}`,
              },
            ],
          });
        }
      });
    }
  },
];

exports.logout = (req, res) => {
  req.session = null;
  res.redirect("/catalog");
};
