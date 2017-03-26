var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
  res.render('index', { title: 'Members' });
});

// middleware
function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated())
    return next()
  else
    return res.redirect("/users/login")
}

module.exports = router;
