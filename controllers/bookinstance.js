const { body, validationResult } = require("express-validator");
const async = require("async");
const Book = require("../models/book");
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

exports.getCreateForm = (_, res, next) => {
  Book.find({}, "title", (err, books) => {
    if (err) {
      return next(err);
    }
    books.sort(function (a, b) {
      let textA = a.title.toUpperCase();
      let textB = b.title.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
    res.render("bookinstanceForm", { title: "Create Book Instance", books });
  });
};

exports.create = [
  body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),
  body("dueBack", "Invalid date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  (req, res, next) => {
    const bookinstance = new BookInstance(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      Book.find({}, "title").exec((err, books) => {
        if (err) {
          return next(err);
        }
        const selectedBook = bookinstance.book;
        books.forEach((b) => {
          if (b._id.toString() === selectedBook._id.toString()) {
            b.selected = "selected";
          } else {
            b.selected = false;
          }
        });
        books.sort(function (a, b) {
          let textA = a.title.toUpperCase();
          let textB = b.title.toUpperCase();
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        });
        res.render("bookinstanceForm", {
          title: "Create Book Instance",
          books,
          errors: errors.array(),
          bookinstance,
        });
        return;
      });
    } else {
      bookinstance.save((err) => {
        if (err) {
          return next(err);
        }
        req.user.updateOne(
          { $push: { bookinstances: bookinstance } },
          (err) => {
            if (err) {
              return next(err);
            }
            res.redirect(bookinstance.url);
          }
        );
      });
    }
  },
];

exports.getRemoveForm = (req, res, next) => {
  if (!req.user.bookinstances.includes(req.params.id)) {
    res.redirect("/catalog/bookinstances");
  }
  BookInstance.findById(req.params.id)
    .populate("book")
    .exec((err, bookinstance) => {
      if (err) {
        return next(err);
      }
      if (!bookinstance) {
        res.redirect("/catalog/bookinstances");
      } else {
        res.render("bookinstanceDelete", {
          title: "Delete Book Instance",
          bookinstance,
        });
      }
    });
};

exports.remove = (req, res, next) => {
  if (!req.user.bookinstances.includes(req.params.id)) {
    res.redirect("/catalog/bookinstances");
  }
  BookInstance.findByIdAndRemove(req.params.id).exec((err) => {
    if (err) {
      return next(err);
    }
    req.user.updateOne({ $pull: { bookinstances: req.params.id } }, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/catalog/bookinstances");
    });
  });
};

exports.getUpdateForm = (req, res, next) => {
  if (!req.user.bookinstances.includes(req.params.id)) {
    res.redirect("/catalog/bookinstances");
  }
  async.parallel(
    {
      bookinstance: (callback) => {
        BookInstance.findById(req.params.id).populate("book").exec(callback);
      },
      books: (callback) => {
        Book.find({}, "title").exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (!results.bookinstance) {
        const err = new Error("Book Instance not found");
        err.status = 404;
        return next(err);
      }
      const selectedBook = results.bookinstance.book;
      results.books.forEach((b) => {
        if (b._id.toString() === selectedBook._id.toString()) {
          b.selected = "selected";
        } else {
          b.selected = false;
        }
      });
      results.books.sort(function (a, b) {
        let textA = a.title.toUpperCase();
        let textB = b.title.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
      res.render("bookinstanceForm", {
        title: "Update Book Instance",
        bookinstance: results.bookinstance,
        books: results.books,
      });
    }
  );
};

exports.update = [
  (req, res, next) => {
    if (!req.user.bookinstances.includes(req.params.id)) {
      res.redirect("/catalog/bookinstances");
    }
    next();
  },
  body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),
  body("dueBack", "Invalid date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  (req, res, next) => {
    const bookinstance = new BookInstance({ ...req.body, _id: req.params.id });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      async.parallel(
        {
          bookinstance: (callback) => {
            BookInstance.findById(req.params.id)
              .populate("book")
              .exec(callback);
          },
          books: (callback) => {
            Book.find({}, "title").exec(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          results.books.sort(function (a, b) {
            let textA = a.title.toUpperCase();
            let textB = b.title.toUpperCase();
            return textA < textB ? -1 : textA > textB ? 1 : 0;
          });
          res.render("bookinstanceForm", {
            title: "Update Book Instance",
            bookinstance: results.bookinstance,
            books: results.books,
          });
        }
      );
      return;
    } else {
      BookInstance.findByIdAndUpdate(req.params.id, bookinstance, {}, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect(bookinstance.url);
      });
    }
  },
];
