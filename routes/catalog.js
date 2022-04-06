const express = require("express");

const router = express.Router();

const book = require("../controllers/book");
router.get("/", book.index);
router.get("/books", book.getList);
router.get("/book/create", book.getCreateForm);
router.post("/book/create", book.create);
router.get("/book/:id", book.getDetail);
router.get("/book/:id/delete", book.getRemoveForm);
router.post("/book/:id/delete", book.remove);
router.get("/book/:id/update", book.getUpdateForm);
router.post("/book/:id/update", book.update);

const author = require("../controllers/author");
router.get("/authors", author.getList);
router.get("/author/create", author.getCreateForm);
router.post("/author/create", author.create);
router.get("/author/:id", author.getDetail);
router.get("/author/:id/delete", author.getRemoveForm);
router.post("/author/:id/delete", author.remove);
router.get("/author/:id/update", author.getUpdateForm);
router.post("/author/:id/update", author.update);

const genre = require("../controllers/genre");
router.get("/genres", genre.getList);
router.get("/genre/create", genre.getCreateForm);
router.post("/genre/create", genre.create);
router.get("/genre/:id", genre.getDetail);
router.get("/genre/:id/delete", genre.getRemoveForm);
router.post("/genre/:id/delete", genre.remove);
router.get("/genre/:id/update", genre.getUpdateForm);
router.post("/genre/:id/update", genre.update);

const bookinstance = require("../controllers/bookinstance");
router.get("/bookinstances", bookinstance.getList);
router.get("/bookinstance/create", bookinstance.getCreateForm);
router.post("/bookinstance/create", bookinstance.create);
router.get("/bookinstance/:id", bookinstance.getDetail);
router.get("/bookinstance/:id/delete", bookinstance.getRemoveForm);
router.post("/bookinstance/:id/delete", bookinstance.remove);
router.get("/bookinstance/:id/update", bookinstance.getUpdateForm);
router.post("/bookinstance/:id/update", bookinstance.update);

module.exports = router;
