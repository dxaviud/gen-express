const User = require("../../models/user");

exports.user = async (req, _, next) => {
  if (req.session?.username) {
    const user = await User.findOne({ username: req.session.username }).exec();
    if (user) {
      req.user = user;
    }
  }
  next();
};
