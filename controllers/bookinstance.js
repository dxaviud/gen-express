const BookInstance = require("../models/bookinstance");

exports.getList = (_, res, next) => {
  BookInstance.find()
    .populate("book")
    .exec((err, list) => {
      if (err) {
        return next(err);
      }
      res.render("bookinstanceList", { title: "Book Instance List", list });
    });
};

exports.getDetail = (req, res, next) => {
  BookInstance.findById(req.params.id)
    .populate("book")
    .exec((err, bookinstance) => {
      if (err) {
        return next(err);
      }
      if (!bookinstance) {
        const err = new Error("Book instance not found");
        err.status = 404;
        return next(err);
      }
      res.render("bookinstanceDetail", {
        title: "Book Instance Detail",
        bookinstance,
      });
    });
};

exports.getCreateForm = (req, res) => {
  res.send("not implemented");
};

exports.create = (req, res) => {
  res.send("not implemented");
};

exports.getRemoveForm = (req, res) => {
  res.send("not implemented");
};

exports.remove = (req, res) => {
  res.send("not implemented");
};

exports.getUpdateForm = (req, res) => {
  res.send("not implemented");
};

exports.update = (req, res) => {
  res.send("not implemented");
};
