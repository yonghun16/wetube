export const localsMiddleware = (req, res, next) => {
  // local object는 global이라서 pug 템플릿과 공유됨
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {};
  console.log(req.session.user);
  next();
};

export const protectorMiddleware = (req, res, next) => {
  // 로그인 된 유저만, 접근 했을 때 진행 (ex: logout, profile edit, delete)
  if (req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/login");
  }
}

export const publicOnlyMiddleware = (req, res, next) => {
  // 로그인 되지 않은 유저가, 접근 했을 때 진행 ()
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
}
