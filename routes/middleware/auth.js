exports.auth = (req, res, next) => {
  if (!req.session?.isPopulated) {
    res.redirect("/login");
  }
  next();
};
