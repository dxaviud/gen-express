const async = require("async");
const { body, validationResult } = require("express-validator");
const Genre = require("../models/genre");
const Book = require("../models/book");

exports.getList = (_, res, next) => {
  Genre.find()
    .sort([["name", "ascending"]])
    .exec((err, list) => {
      if (err) {
        return next(err);
      }
      res.render("genreList", { title: "Genre List", list });
    });
};

exports.getDetail = (req, res, next) => {
  async.parallel(
    {
      genre: (callback) => {
        Genre.findById(req.params.id).exec(callback);
      },
      genreBooks: (callback) => {
        Book.find({ genre: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (!results.genre) {
        const err = new Error("Genre not found");
        err.status = 404;
        return next(err);
      }
      res.render("genreDetail", {
        title: "Genre Detail",
        genre: results.genre,
        genreBooks: results.genreBooks,
        owns: req.user.genres.includes(results.genre._id),
      });
    }
  );
};

exports.getCreateForm = (_, res) => {
  res.render("genreForm", { title: "Create Genre" });
};

exports.create = [
  body("name", "Genre name required")
    .trim()
    .isLength({ min: 2, max: 100 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const genre = new Genre({ name: req.body.name });
    if (!errors.isEmpty()) {
      res.render("genreForm", {
        title: "Create Genre",
        genre,
        errors: errors.array(),
      });
      return;
    } else {
      Genre.findOne({ name: req.body.name }).exec((err, foundGenre) => {
        if (err) {
          return next(err);
        }
        if (foundGenre) {
          res.redirect(foundGenre.url);
        } else {
          genre.save((err) => {
            if (err) {
              return next(err);
            }
            req.user.updateOne({ $push: { genres: genre } }, (err) => {
              if (err) {
                return next(err);
              }
              res.redirect(genre.url);
            });
          });
        }
      });
    }
  },
];

exports.getRemoveForm = (req, res, next) => {
  if (!req.user.genres.includes(req.params.id)) {
    res.redirect("/catalog/genres");
  }
  async.parallel(
    {
      genre: (callback) => {
        Genre.findById(req.params.id).exec(callback);
      },
      books: (callback) => {
        Book.find({ genre: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (!results.genre) {
        res.redirect("/catalog/genres");
      } else {
        res.render("genreDelete", {
          title: "Delete Genre",
          genre: results.genre,
          books: results.books,
        });
      }
    }
  );
};

exports.remove = (req, res, next) => {
  if (!req.user.genres.includes(req.params.id)) {
    res.redirect("/catalog/genres");
  }
  async.parallel(
    {
      genre: (callback) => {
        Genre.findById(req.params.id).exec(callback);
      },
      books: (callback) => {
        Book.find({ genre: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.books.length > 0) {
        res.render("genreDelete", {
          title: "Delete Genre",
          genre: results.genre,
          books: results.books,
        });
      } else {
        Genre.findByIdAndRemove(req.params.id, (err) => {
          if (err) {
            return next(err);
          }
          req.user.updateOne({ $pull: { genres: req.params.id } }, (err) => {
            if (err) {
              return next(err);
            }
            res.redirect("/catalog/genres");
          });
        });
      }
    }
  );
};

exports.getUpdateForm = (req, res, next) => {
  if (!req.user.genres.includes(req.params.id)) {
    res.redirect("/catalog/genres");
  }
  Genre.findById(req.params.id, (err, genre) => {
    if (err) {
      return next(err);
    }
    res.render("genreForm", { title: "Create Genre", genre });
  });
};

exports.update = [
  (req, res, next) => {
    if (!req.user.genres.includes(req.params.id)) {
      res.redirect("/catalog/genres");
    }
    next();
  },
  body("name", "Genre name required")
    .trim()
    .isLength({ min: 2, max: 100 })
    .escape(),
  (req, res, next) => {
    const genre = new Genre({ name: req.body.name, _id: req.params.id });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("genreForm", {
        title: "Create Genre",
        genre,
        errors: errors.array(),
      });
      return;
    } else {
      Genre.findByIdAndUpdate(req.params.id, genre, {}, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect(genre.url);
      });
    }
  },
];
