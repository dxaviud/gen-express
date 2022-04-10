const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, minLength: 1, maxLength: 100 },
  password: { type: String, required: true, minLength: 1 },
  authors: [{ type: Schema.Types.ObjectId, ref: "Author" }],
  books: [{ type: Schema.Types.ObjectId, ref: "Book" }],
  bookinstances: [{ type: Schema.Types.ObjectId, ref: "BookInstance" }],
  genres: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
});

UserSchema.virtual("url").get(function () {
  return "/users/" + this.username;
});

module.exports = mongoose.model("User", UserSchema);
