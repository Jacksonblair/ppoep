var middlewareObj = {};
var Submtx      = require("../models/submtx");
var Comment     = require("../models/comment");

middlewareObj.checkSubmtxOwnership = function(req, res, next){
        // is user logged in ?
   if (req.isAuthenticated()){
        Submtx.findById(req.params.submtx_id, function(err, foundSubmtx){
            if (err || !foundSubmtx)  {
                console.log("HI THERE!");
                req.flash("error", "Mtx not found!");
                res.redirect("/mtx");
            }  else {
                // does user own campground?
                if (foundSubmtx.author.id.equals(req.user._id)){
                    next();   
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("/mtx/" + req.params.submtx_id);
                }
            }
        });    
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("/login");
    }  
};


middlewareObj.checkCommentOwnership = function(req, res, next){
   if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err || !foundComment)  {
                req.flash("error", "Comment not found!");
                res.redirect("/mtx/" + req.params.submtx_id);
            }  else {
                // does user own comment?
                if (foundComment.author.id.equals(req.user._id)){
                    next();   
                } else {
                    req.flash("error", "You don't have permission to do that!")
                    res.redirect("back");
                }
            }
        });    
    } else {
        req.flash("error", "You need to be logged in to do that!")
        res.redirect("back");
    }  
};


middlewareObj.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!")
    res.redirect("/login");
}


module.exports = middlewareObj;