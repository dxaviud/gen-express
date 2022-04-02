const mongoose = require("mongoose");

const AuthorSchema = new mongoose.Schema({
  firstName: { type: String, required: true, maxLength: 100 },
  familyName: { type: String, required: true, maxLength: 100 },
  dateOfBirth: { type: Date },
  dateOfDeath: { type: Date },
});

AuthorSchema.virtual("name").get(function () {
  let fullname = "";
  if (this.firstName && this.familyName) {
    fullname = this.familyName + ", " + this.firstName;
  } else if (this.firstName) {
    fullname = this.firstName;
  } else if (this.familyName) {
    fullname = this.familyName;
  }
  return fullname;
});

AuthorSchema.virtual("lifespan").get(function () {
  let lifespan = "";
  if (this.dateOfBirth) {
    lifespan = this.dateOfBirth.getYear().toString();
  }
  lifespan += " - ";
  if (this.dateOfDeath) {
    lifespan += this.dateOfDeath.getYear();
  }
  return lifespan;
});

AuthorSchema.virtual("url").get(function () {
  return "/catalog/author/" + this._id;
});

module.exports = mongoose.model("Author", AuthorSchema);
