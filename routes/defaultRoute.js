const express = require("express");
const router = express.Router();
const passport = require("passport");


router.get("/login", (req, res, next) => {
  if (req.user) {
    res.redirect("/auth");
  }
  next()
})




router.get("/", (req, res, next) => {
  res.render("home", {
    title: "Home page"
  })
})

router.get("/login", (req, res, next) => {
  res.render("login", {
    title: "Login page"
  })
})

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
})


router.get("/github", (passport.authenticate('github')))

router.get('/auth/github/cb',
  passport.authenticate('github', {
    failureRedirect: '/'
  }),
  function (req, res) {
    res.redirect('/auth');
  });


module.exports = router