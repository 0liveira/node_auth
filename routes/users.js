var express = require('express');
var router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "./uploads" });
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/user")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/register", function (req, res, next) {
  res.render("register", { title: "Register" })
});

router.get("/login", function (req, res, next) {
  res.render("login", { title: "Login" })
});

router.post("/login", passport.authenticate("local", { failureRedirect: "/users/login", failureFlash: "Invalid username or password" }), function (req, res) {
  req.flash("success", "You are now logged in")
  res.redirect("/")
})

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.getUserById(id, (error, user) => {
    done(error, user)
  })
})

passport.use(new LocalStrategy((username, password, done) => {
  User.getUserByUsername(username, (error, user) => {
    if (error)
      throw error
    if (!user)
      return done(null, false, { message: "Inexistent username" })
    
    User.comparePassword(password, user.password, (error, isMatch) => {
      if (error)
        return done(error)
      if (isMatch)
        return done(null, user)
      else
        return done(null, false, { message: "Invalid Password" })
    })
  })
}))

router.post("/register", upload.single("profileImage"), function (req, res, next) {
  let name = req.body.name
  let email = req.body.email
  let username = req.body.username
  let password = req.body.password
  let password2 = req.body.password2
  let profileImage

  if (req.file){
    console.log("Uploading file...")
    profileImage = req.file.filename
  } else {
    console.log("No file uploaded...")
    profileImage = "noimage.jpg"
  }

  // Form validator
  req.checkBody("name", "Name field is required").notEmpty()
  req.checkBody("email", "Email field is required").notEmpty()
  req.checkBody("email", "Email is not valid").isEmail()
  req.checkBody("username", "Username field is required").notEmpty()
  req.checkBody("password", "Password field is required").notEmpty()
  req.checkBody("password2", "Passwords do not match").equals(req.body.password)

  // Check errors
  let errors = req.validationErrors()

  if (errors) {
    res.render("register", { errors })
  } else {
    const newUser = new User({ name, email, username, password, profileImage })

    User.createUser(newUser, (error, user) => {
      if (error)
        throw error
      console.log(user)
    })

    req.flash("success", "You are now registered and can login")

    res.location("/")
    res.redirect("/")
  }
});

router.get("/logout", function (req, res) {
  req.logout()
  req.flash("success", "You are now logged out")
  res.redirect("/users/login")
})

module.exports = router;
