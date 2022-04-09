const mongoose = require("mongoose");
const { DateTime } = require("luxon");

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
  let lifespan = "Unknown";
  if (this.dateOfBirth) {
    lifespan = DateTime.fromJSDate(this.dateOfBirth).toLocaleString(
      DateTime.DATE_MED
    );
  }
  lifespan += " - ";
  if (this.dateOfDeath) {
    lifespan += DateTime.fromJSDate(this.dateOfDeath).toLocaleString(
      DateTime.DATE_MED
    );
  } else {
    lifespan += "Unknown";
  }
  return lifespan;
});

AuthorSchema.virtual("formInputDateOfBirth").get(function () {
  return this.dateOfBirth ? this.dateOfBirth.toISOString().split("T")[0] : "";
});

AuthorSchema.virtual("formInputDateOfDeath").get(function () {
  return this.dateOfDeath ? this.dateOfDeath.toISOString().split("T")[0] : "";
});

AuthorSchema.virtual("url").get(function () {
  return "/catalog/author/" + this._id;
});

module.exports = mongoose.model("Author", AuthorSchema);
