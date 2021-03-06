var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    User        = require("../models/user"),
    Submtx      = require("../models/submtx"),
    async       = require("async"),
    nodemailer  = require("nodemailer"),
    crypto      = require("crypto");
    

// LANDING PAGE ROUTE
router.get("/", function(req, res){
    res.render("landing");
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
    var newUser = new User({username: req.body.username, email: req.body.email});
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

// FORGOT PASSWORD ROUTE
router.get("/forgot", function(req, res) {
   res.render("forgot"); 
});


// BORROWED: http://sahatyalkabov.com/how-to-implement-password-reset-in-nodejs/
router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
        // token generation
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
        // find user by e-mail
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
            // if no matching user, flash error, and re-direct to /forgot
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }
            // set resetpassword token
            // set resettoken expiry time
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: 'jacksonblair',
          pass: process.env.SENDGRIDPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'ppoepbox@gmail.com',
        subject: 'PPOEP Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

// TOKEN PASSWORD RESET ROUTE
router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {user: req.user});
  });
});

// TOKEN PASSWORD RESET ROUTE
router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
          req.logIn(user, function(err) {
            done(err, user);
          });
        });
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'SendGrid',
        auth: {
          user: '!!! YOUR SENDGRID USERNAME !!!',
          pass: '!!! YOUR SENDGRID PASSWORD !!!'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
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