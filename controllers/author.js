const async = require("async");
const { body, validationResult } = require("express-validator");
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
        owns: req.user.authors.includes(results.author._id),
      });
    }
  );
};

exports.getCreateForm = (_, res) => {
  res.render("authorForm", { title: "Create Author" });
};

exports.create = [
  body("firstName")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("familyName")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("dateOfBirth", "Invalid date of birth")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body("dateOfDeath", "Invalid date of death")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("authorForm", {
        title: "Create Author",
        author: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      const author = new Author(req.body);
      author.save((err) => {
        if (err) {
          return next(err);
        }
        req.user.updateOne({ $push: { authors: author } }, (err) => {
          if (err) {
            return next(err);
          }
          res.redirect(author.url);
        });
      });
    }
  },
];

exports.getRemoveForm = (req, res, next) => {
  if (!req.user.authors.includes(req.params.id)) {
    res.redirect("/catalog/authors");
  }
  async.parallel(
    {
      author: (callback) => {
        Author.findById(req.params.id).exec(callback);
      },
      books: (callback) => {
        Book.find({ author: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (!results.author) {
        res.redirect("/catalog/authors");
      } else {
        res.render("authorDelete", {
          title: "Delete Author",
          author: results.author,
          books: results.books,
        });
      }
    }
  );
};

exports.remove = (req, res, next) => {
  if (!req.user.authors.includes(req.params.id)) {
    res.redirect("/catalog/authors");
  }
  async.parallel(
    {
      author: (callback) => {
        Author.findById(req.params.id).exec(callback);
      },
      books: (callback) => {
        Book.find({ author: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.books.length > 0) {
        res.render("authorDelete", {
          title: "Delete Author",
          author: results.author,
          books: results.books,
        });
      } else {
        Author.findByIdAndRemove(req.params.id, (err) => {
          if (err) {
            return next(err);
          }
          req.user.updateOne({ $pull: { authors: req.params.id } }, (err) => {
            if (err) {
              return next(err);
            }
            res.redirect("/catalog/authors");
          });
        });
      }
    }
  );
};

exports.getUpdateForm = (req, res, next) => {
  if (!req.user.authors.includes(req.params.id)) {
    res.redirect("/catalog/authors");
  }
  Author.findById(req.params.id, (err, author) => {
    if (err) {
      return next(err);
    }
    res.render("authorForm", { title: "Update Author", author });
  });
};

exports.update = [
  (req, res, next) => {
    if (!req.user.authors.includes(req.params.id)) {
      res.redirect("/catalog/authors");
    }
    next();
  },
  body("firstName")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("familyName")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("dateOfBirth", "Invalid date of birth")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body("dateOfDeath", "Invalid date of death")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("authorForm", {
        title: "Create Author",
        author: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      const author = new Author({ ...req.body, _id: req.params.id });
      Author.findByIdAndUpdate(req.params.id, author, {}, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect(author.url);
      });
    }
  },
];
