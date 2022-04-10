const express = require("express");
const { auth, user } = require("./middleware");

const router = express.Router();

const book = require("../controllers/book");
router.get("/", book.index);
router.get("/books", book.getList);
router.get("/book/create", auth, book.getCreateForm);
router.post("/book/create", auth, user, book.create);
router.get("/book/:id", book.getDetail);
router.get("/book/:id/delete", auth, user, book.getRemoveForm);
router.post("/book/:id/delete", auth, user, book.remove);
router.get("/book/:id/update", auth, user, book.getUpdateForm);
router.post("/book/:id/update", auth, user, book.update);

const author = require("../controllers/author");
router.get("/authors", author.getList);
router.get("/author/create", auth, author.getCreateForm);
router.post("/author/create", auth, user, author.create);
router.get("/author/:id", author.getDetail);
router.get("/author/:id/delete", auth, user, author.getRemoveForm);
router.post("/author/:id/delete", auth, user, author.remove);
router.get("/author/:id/update", auth, user, author.getUpdateForm);
router.post("/author/:id/update", auth, user, author.update);

const genre = require("../controllers/genre");
router.get("/genres", genre.getList);
router.get("/genre/create", auth, genre.getCreateForm);
router.post("/genre/create", auth, user, genre.create);
router.get("/genre/:id", genre.getDetail);
router.get("/genre/:id/delete", auth, user, genre.getRemoveForm);
router.post("/genre/:id/delete", auth, user, genre.remove);
router.get("/genre/:id/update", auth, user, genre.getUpdateForm);
router.post("/genre/:id/update", auth, user, genre.update);

const bookinstance = require("../controllers/bookinstance");
router.get("/bookinstances", bookinstance.getList);
router.get("/bookinstance/create", auth, bookinstance.getCreateForm);
router.post("/bookinstance/create", auth, user, bookinstance.create);
router.get("/bookinstance/:id", bookinstance.getDetail);
router.get("/bookinstance/:id/delete", auth, user, bookinstance.getRemoveForm);
router.post("/bookinstance/:id/delete", auth, user, bookinstance.remove);
router.get("/bookinstance/:id/update", auth, user, bookinstance.getUpdateForm);
router.post("/bookinstance/:id/update", auth, user, bookinstance.update);

module.exports = router;
