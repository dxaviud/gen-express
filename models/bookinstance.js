const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const BookInstanceSchema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: "Book", required: true }, //reference to the associated book
  imprint: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["Available", "Maintenance", "Loaned", "Reserved"],
    default: "Maintenance",
  },
  dueBack: { type: Date, default: Date.now },
});

BookInstanceSchema.virtual("url").get(function () {
  return "/catalog/bookinstance/" + this._id;
});

BookInstanceSchema.virtual("dueBackFormatted").get(function () {
  return this.dueBack
    ? DateTime.fromJSDate(this.dueBack).toLocaleString(DateTime.DATE_MED)
    : "";
});

BookInstanceSchema.virtual("formInputDueBack").get(function () {
  return this.dueBack ? this.dueBack.toISOString().split("T")[0] : "";
});

module.exports = mongoose.model("BookInstance", BookInstanceSchema);
