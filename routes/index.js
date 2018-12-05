var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    User        = require("../models/user")

// LANDING PAGE ROUTE
router.get("/", function(req, res){
    res.redirect("/mtx");
});

///////////////////////////
// AUTHENTICATION ROUTES //
///////////////////////////

// SHOW REGISTER FORM
router.get("/register", function(req, res) {
   res.render("register"); 
});

// HANDLE SIGN UP LOGIC
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
       if (err) {
           req.flash("error", err.message)
           return res.redirect("/register")
       } 
       passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to PPOEP " + user.username);
           res.redirect("/mtx");
       });
    });
});

// SHOW LOGIN FORM
router.get("/login", function(req, res) {
   res.render("login"); 
});

// HANDLE LOGIN LOGIC
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/mtx", 
        failureRedirect: "/login"
    }), function(req, res) {
});

// LOGOUT ROUTE
router.get("/logout", function(req, res) {
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/mtx");
});

// USER PROFILE ROUTE
router.get("/users/:user_id", function(req, res) {
    User.findById(req.params.user_id, function(err, foundUser){
       if (err) {
           req.flash("error", "User not found.");
           res.redirect("back");
       } else {
           res.render("users/show", {user: foundUser})
       }
    });
});

module.exports = router;