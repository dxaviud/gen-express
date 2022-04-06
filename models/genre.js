const mongoose = require("mongoose");

const GenreSchema = new mongoose.Schema({
  name: { type: String, require: true, minLength: 2, maxLength: 100 },
});

GenreSchema.virtual("url").get(function () {
  return "/catalog/genre/" + this._id;
});

module.exports = mongoose.model("Genre", GenreSchema);
