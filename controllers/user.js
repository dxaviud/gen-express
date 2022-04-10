const User = require("../models/user");

exports.listUsers = (_, res, next) => {
  User.find()
    .populate("authors")
    .populate("books")
    .populate("bookinstances")
    .populate("genres")
    .exec((err, users) => {
      if (err) {
        return next(err);
      }
      res.render("users", { title: "All Users", users });
    });
};
