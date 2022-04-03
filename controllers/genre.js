const async = require("async");
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
