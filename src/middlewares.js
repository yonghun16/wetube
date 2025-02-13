export const localsMiddleware = (req, res, next) => {
  // local object는 global이라서 pug 템플릿과 공유됨
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {};
  next();
};
