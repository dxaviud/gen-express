const async = require("async");
const Author = require("../models/author");
const Book = require("../models/book");

exports.getList = (_, res, next) => {
  Author.find()
    .sort([["familyName", "ascending"]])
    .exec((err, list) => {
      if (err) {
        return next(err);
      }
      res.render("authorList", { title: "Author List", list });
    });
};

exports.getDetail = (req, res, next) => {
  async.parallel(
    {
      author: (callback) => {
        Author.findById(req.params.id).exec(callback);
      },
      authorBooks: (callback) => {
        Book.find({ author: req.params.id }, "title summary").exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (!results.author) {
        const err = new Error("Author not found");
        err.status = 404;
        return next(err);
      }
      res.render("authorDetail", {
        title: "Author Detail",
        author: results.author,
        authorBooks: results.authorBooks,
      });
    }
  );
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
