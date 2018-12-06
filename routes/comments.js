var express = require("express"),
    router  = express.Router({mergeParams: true}),
    Submtx  = require("../models/submtx"),
    Comment = require("../models/comment"),
    middleware  = require("../middleware")


// NEW COMMENT ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res) {
    // find submtx by id
    Submtx.findById(req.params.submtx_id, function(err, foundSubmtx){
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {submtx: foundSubmtx});
        }
    });
});

// CREATE COMMENT ROUTE
router.post("/", middleware.isLoggedIn, function(req, res){
    Submtx.findById(req.params.submtx_id, function(err, foundSubmtx){
       if (err) {
           console.log(err);
           res.redirect("/mtx");
       } else {
           Comment.create(req.body.comment, function(err, comment){
               if (err) {
                   req.flash("error", "Something went wrong.")
                   console.log(err);
               } else {
                   console.log(comment);
                   // add username and id to comment
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   // save comment
                   comment.save();
                   foundSubmtx.comments.push(comment);
                   foundSubmtx.save();
                   req.flash("success", "Successfully created comment!");
                   res.redirect("/mtx/" + foundSubmtx._id);
               }
           });
       }
    });
});

// EDIT COMMENT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err || !foundComment) {
            req.flash("error", "Campground not found!");
            return res.redirect("back");
                        // res.render("comments/edit", {campground_id: req.params.submtx_id, comment: foundComment});   
        }
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                res.render("comments/edit", {submtx_id: req.params.submtx_id, comment: foundComment});            
            }
        });
    });
});

// UPDATE COMMENT ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/mtx/" + req.params.submtx_id)
        }
    })
});

// DELETE COMMENT ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findbyidanrremove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted!");
            res.redirect("/mtx/" + req.params.submtx_id);
        }
    })
});

module.exports = router;