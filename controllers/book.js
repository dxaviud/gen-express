const async = require("async");
const { body, validationResult } = require("express-validator");
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

exports.getCreateForm = (req, res, next) => {
  async.parallel(
    {
      authors: (callback) => {
        Author.find(callback);
      },
      genres: (callback) => {
        Genre.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("bookForm", {
        title: "Create Book",
        authors: results.authors,
        genres: results.genres,
      });
    }
  );
};

exports.create = [
  (req, _, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === undefined) {
        req.body.genre = [];
      } else {
        req.body.genre = new Array(req.body.genre);
      }
    }
    next();
  },
  body("title", "Title must not be empty").trim().isLength({ min: 1 }).escape(),
  body("author", "Author must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
  body("genre.*").escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const book = new Book(req.body);
    if (!errors.isEmpty()) {
      async.parallel(
        {
          authors: (callback) => {
            Author.find(callback);
          },
          genres: (callback) => {
            Genre.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          results.authors.forEach((a) => {
            if (a._id.toString() === book.author._id.toString()) {
              a.selected = "selected";
            } else {
              a.selected = false;
            }
          });
          results.authors.sort((a, b) => {
            a = a.familyName.toUpperCase();
            b = b.familyName.toUpperCase();
            if (a < b) {
              return -1;
            } else if (a > b) {
              return 1;
            } else {
              return 0;
            }
          });
          for (const genre of results.genres) {
            if (book.genre.includes(genre._id)) {
              genre.checked = "true";
            }
          }
          res.render("bookForm", {
            title: "Create Book",
            authors: results.authors,
            genres: results.genres,
            book,
            errors: errors.array(),
          });
        }
      );
    } else {
      book.save((err) => {
        if (err) {
          return next(errr);
        }
        res.redirect(book.url);
      });
    }
  },
];

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
