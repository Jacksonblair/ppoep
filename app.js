var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    Submtx          = require("./models/submtx"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    methodOverride  = require("method-override"),
    seedDB          = require("./seeds")
    
var commentRoutes       = require("./routes/comments"),
    mtxRoutes           = require("./routes/mtx"),
    indexRoutes          = require("./routes/index")
    

mongoose.connect("mongodb://localhost/ppoep", {useNewUrlParser: true});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public")); // serving the public directory
app.use(methodOverride("_method"));
app.use(flash());

// seedDB(); // Seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "woftam",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

// requiring routes
app.use(indexRoutes);
app.use("/mtx/:submtx_id/comments", commentRoutes);
app.use("/mtx", mtxRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("PPOEP server has started.")
})