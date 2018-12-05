var express     = require("express"),
    router      = express.Router(),
    Submtx      = require("../models/submtx"),
    // requring a directory that contains an index.js, will automatically include the index.js
    middleware  = require("../middleware")


// INDEX ROUTE - SHOW ALL MTX
router.get("/", function(req, res){
    // get all submtx from DB
    Submtx.find({}, function(err, allSubmtx){
        if (err) {
            console.log(err);
        } else {
            res.render("mtx/index", {submtx: allSubmtx})             
        }
    });
});

// CREATE SUBMTX ROUTE
router.post("/", middleware.isLoggedIn, function(req, res){
    var title = req.body.title;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newSubmtx = {title: title, image: image, description: description, author: author};
    // create new submtx and save to database
    Submtx.create(newSubmtx, function(err, newlyCreated){
        if (err) {
            console.log(err);
        } else {
            // redirect back to mtx page
            console.log(newlyCreated.author);
            res.redirect("/mtx");
        }
    });
});


// NEW SUBMTX ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("mtx/new"); 
});


// SHOW SUBMTX ROUTE
router.get("/:submtx_id", function(req, res) {
    // find the submtx with provided ID
    Submtx.findById(req.params.submtx_id).populate("comments").exec(function(err, foundSubmtx){
       if (err || !foundSubmtx) {
            req.flash("error", "Mtx not found!");
            res.redirect("/mtx");
       } else {
            // render the show template with that submtx
            res.render("mtx/show", {submtx: foundSubmtx})
       }
    });
});

// EDIT SUBMTX ROUTE
router.get("/:submtx_id/edit", middleware.checkSubmtxOwnership, function(req, res) {
    Submtx.findById(req.params.submtx_id, function(err, foundSubmtx){
        // middleware handles error
        res.render("mtx/edit", {submtx: foundSubmtx});
    });
});

// UPDATE SUBMTX ROUTE
router.put("/:submtx_id/", middleware.checkSubmtxOwnership, function(req, res){
    // find submtx and update, then redirect to edited submtx
    Submtx.findByIdAndUpdate(req.params.submtx_id, req.body.submtx, function(err, updatedSubmtx){
        if (err) {
            res.redirect("/mtx");
        } else {
            res.redirect("/mtx/" + req.params.submtx_id);
        }
    })
});

// DESTROY SUBMTX ROUTE
router.delete("/:submtx_id/", middleware.checkSubmtxOwnership, function(req, res){
   Submtx.findByIdAndRemove(req.params.submtx_id, function(err){
       if (err) {
           res.redirect("/mtx");
       } else {
           res.redirect("/mtx");
       }
   });
});

module.exports = router;