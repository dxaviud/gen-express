const async = require("async");
const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");

exports.index = (_, res) => {
  async.parallel(
    {
      bookCount: (callback) => {
        Book.countDocuments({}, callback);
      },
      bookinstanceCount: (callback) => {
        BookInstance.countDocuments({}, callback);
      },
      bookinstanceAvailableCount: (callback) => {
        BookInstance.countDocuments({ status: "Available" }, callback);
      },
      authorCount: (callback) => {
        Author.countDocuments({}, callback);
      },
      genreCount: (callback) => {
        Genre.countDocuments({}, callback);
      },
    },
    (err, results) => {
      res.render("index", {
        title: "Local Library Home",
        error: err,
        data: results,
      });
    }
  );
};

exports.getList = (_, res, next) => {
  Book.find({}, "title author")
    .sort({ title: 1 })
    .populate("author")
    .exec((err, list) => {
      if (err) {
        return next(err);
      }
      res.render("bookList", { title: "Book List", list });
    });
};

exports.getDetail = (req, res, next) => {
  async.parallel(
    {
      book: (callback) => {
        Book.findById(req.params.id)
          .populate("author")
          .populate("genre")
          .exec(callback);
      },
      bookInstances: (callback) => {
        BookInstance.find({ book: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (!results.book) {
        const err = new Error("Book not found");
        err.status = 404;
        return next(err);
      }
      res.render("bookDetail", {
        title: "Book Detail",
        book: results.book,
        bookInstances: results.bookInstances,
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
