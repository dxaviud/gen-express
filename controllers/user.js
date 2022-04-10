const User = require("../models/user");

exports.list = (_, res, next) => {
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

exports.get = (req, res, next) => {
  User.findOne({ username: req.params.username })
    .populate("authors")
    .populate("books")
    .populate("bookinstances")
    .populate("genres")
    .exec((err, user) => {
      if (err) {
        return next(err);
      }
      res.render("user", { title: user.username, user });
    });
};
